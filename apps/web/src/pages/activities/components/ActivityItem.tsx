import { Grid, Text, useMantineTheme } from '@mantine/core';
import { colors } from '../../../design-system';
import styled from 'styled-components';
import { When } from '../../../components/utils/When';
import { format } from 'date-fns';
import { useNotificationStatus } from '../hooks/useNotificationStatus';
import { ActivityStep } from './ActivityStep';
import { CheckCircle, ErrorIcon, Timer } from '../../../design-system/icons';
import { ExecutionDetailsStatusEnum } from '@novu/shared';

export const ActivityItem = ({ item }) => {
  const status = useNotificationStatus(item);
  const theme = useMantineTheme();

  return (
    <ListItem key={`activity-item-${item.id}`} dark={theme.colorScheme === 'dark'}>
      <Grid gutter={10}>
        <Grid.Col span={3}>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <Grid align="center">
              <Grid.Col span={2}>
                <span
                  style={{
                    marginRight: '15px',
                  }}
                >
                  <When
                    truthy={
                      status !== ExecutionDetailsStatusEnum.SUCCESS && status !== ExecutionDetailsStatusEnum.FAILED
                    }
                  >
                    <Timer width={26} height={26} />
                  </When>
                  <When truthy={status === ExecutionDetailsStatusEnum.SUCCESS}>
                    <CheckCircle width="26" height="26" color={colors.success} />
                  </When>
                  <When truthy={status === ExecutionDetailsStatusEnum.FAILED}>
                    <ErrorIcon width="26" height="26" color={colors.error} />
                  </When>
                </span>
              </Grid.Col>
              <Grid.Col span={10}>
                <h3
                  style={{
                    margin: '0px',
                    marginBottom: '8px',
                  }}
                  data-test-id="row-template-name"
                >
                  {/**Adding a null check until fixed */}
                  {item?.template?.name || `template name not found`}
                </h3>
                <When truthy={status === ExecutionDetailsStatusEnum.SUCCESS}>
                  <Text data-test-id="status-badge-item" color={colors.success}>
                    Done
                  </Text>
                </When>
                <When truthy={status === ExecutionDetailsStatusEnum.FAILED}>
                  <Text data-test-id="status-badge-item" color={colors.error}>
                    Failed
                  </Text>
                </When>
              </Grid.Col>
            </Grid>
          </div>
          <div>
            <small>
              <b>Date:</b> {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
            </small>
            <div data-test-id="subscriber-id">
              <small>
                <b>Subscriber id:</b> {item.subscriber.id}
              </small>
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={9}>
          <Grid
            columns={item.jobs.length > 3 ? 10 : 12}
            justify="end"
            align="center"
            sx={{
              margin: 0,
              height: '100%',
            }}
          >
            {item.jobs.slice(0, 3).map((job) => (
              <ActivityStep key={`activity-step-${job._id}`} span={item.jobs.length > 3 ? 3 : 4} job={job} />
            ))}
            <When truthy={item.jobs.length > 3}>
              <Grid.Col span={1}>
                <Text align="center" size="xl">
                  +{item.jobs.length - 3}
                </Text>
              </Grid.Col>
            </When>
          </Grid>
        </Grid.Col>
      </Grid>
    </ListItem>
  );
};

const ListItem = styled.div<{ dark: boolean }>`
  padding: 20px;
  padding-left: 15px;
  margin-left: 30px;
  margin-right: 30px;
  border: 1px solid ${({ dark }) => (dark ? colors.B30 : colors.B80)};
  margin-bottom: 15px;
  border-radius: 7px;
  color: ${({ dark }) => (dark ? colors.B80 : colors.B40)};
`;
