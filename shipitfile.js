module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  const { program } = require('commander');

  program
    .option('-r, --revision <rev>', 'Branch, commit or tag')
    .option('-s, --server <rev>', 'Server IP')
    .parse(process.argv);

  const options = program.opts();
  shipit.initConfig({
    default: {
      repositoryUrl: 'https://github.com/tech-project-github/novu.git',
      workspace: '/tmp/github-monitor',
      ignores: ['.git', 'node_modules'],
      keepReleases: 3,
      shared: {
        overwrite: true,
        dirs: [`node_modules`], // todo: add node_modules to this.
      },
    },
    production: {
      servers: `ubuntu@${options.server}`,
      branch: options.revision,
      deployTo: '/home/ubuntu/novu',
    },
  });

  shipit.on('deploy', function () {
    shipit.log('Deploy started!');
  });

  shipit.on('sharedEnd', function () {
    return runTasks([
      'npm run setup:project',
      'pm2 stop novu-api',
      'pm2 delete novu-api',
      'pm2 start /home/ubuntu/ecosystem.config.js --only novu-api',
      'pm2 stop novu-ws',
      'pm2 delete novu-ws',
      'pm2 start /home/ubuntu/ecosystem.config.js --only novu-ws',
      'pm2 stop novu-web',
      'pm2 delete novu-web',
      'pm2 start /home/ubuntu/ecosystem.config.js --only novu-web',
    ]);
  });

  // run tasks on server
  var runTasks = function (tasks) {
    var cwd = shipit.releasePath;
    var unfoldTasks = function () {
      if (tasks.length > 0) {
        var task = 'cd ' + cwd + ' && ' + tasks.splice(0, 1)[0];

        return function () {
          // eslint-disable-next-line promise/always-return
          shipit.remote(task).then(function () {
            runTasks(tasks);
          });
        };
      } else {
        return function () {
          shipit.log('Deploy completed');
        };
      }
    };
    unfoldTasks()();
  };
};
