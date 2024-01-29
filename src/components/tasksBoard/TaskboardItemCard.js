import React, { useEffect } from "react";
import { Button, Card, Modal, Typography, Dropdown, Menu } from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import styled from "styled-components";
import BaseTooltip from "../shared/BaseTooltip";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import projectDoneAtom from "../../statesManager/projectCompleted";

const StyledCard = styled(Card)`
  margin: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ $isDragging }) => ($isDragging ? "#fafafa" : "#fff")};
`;

const TaskboardItemCardTitle = styled(Typography.Title)`
  white-space: pre-wrap;
  margin-right: 0.25rem;
`;

const DeleteMenuItem = styled(Menu.Item)`
  color: ${red.primary};
`;

function TaskboardItemCard({
  item,
  status,
  isDragging,
  onEdit,
  onDelete,
  itemsByStatus,
}) {

  const [projectDone, setProjectDone] = useRecoilState(projectDoneAtom);

  let tasksCount =
    itemsByStatus["In Progress"].length === 0 &&
    itemsByStatus["To Do"].length === 0 &&
    itemsByStatus["Done"].length !== 0;

  useEffect(() => {
    if (tasksCount) {
      setTimeout(() => {
        setProjectDone(true);
        localStorage.setItem("ProjectDone", true);
      }, 1000);
    } else {
      setProjectDone(false);
      localStorage.setItem("ProjectDone", false);
      localStorage.removeItem("finishedData");
    }
  }, [
    setProjectDone,
    itemsByStatus,
    projectDone,
    tasksCount,
  ]);

  return (
    <StyledCard
      $isDragging={isDragging}
      size="small"
      title={
        <BaseTooltip overlay={item.title}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TaskboardItemCardTitle
              key={uuidv4()}
              level={5}
              ellipsis={{ rows: 2 }}
            >
              {item.title}
            </TaskboardItemCardTitle>
          </span>
        </BaseTooltip>
      }
      extra={
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key={uuidv4()}
                icon={<EditOutlined />}
                onClick={() => onEdit(item)}
              >
                Edit
              </Menu.Item>
              <DeleteMenuItem
                key={uuidv4()}
                icon={<DeleteOutlined />}
                onClick={() =>
                  Modal.confirm({
                    title: "Delete?",
                    content: `Are you sure to delete "${item.title}"?`,
                    onOk: () =>
                      onDelete({
                        status,
                        itemToDelete: item,
                      }),
                  })
                }
              >
                Delete
              </DeleteMenuItem>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button size="small" icon={<MoreOutlined />} />
        </Dropdown>
      }
    >
      <BaseTooltip overlay={item.description}>
        <Typography.Paragraph
          key={uuidv4()}
          type="secondary"
          ellipsis={{ rows: 2 }}
        >
          {item.description}
        </Typography.Paragraph>
      </BaseTooltip>
    </StyledCard>
  );
}

export default TaskboardItemCard;