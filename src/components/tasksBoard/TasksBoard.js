import { DragDropContext } from "react-beautiful-dnd";
import { useEffect, useMemo, useState } from "react";
import produce from "immer";
import styled from "styled-components";
import { TaskboardItemStatus } from "./TaskboardTypes";
import TaskboardItemModal from "./TasksBoardItemModal";
import TaskboardCol from "./TaskboardCol";
import { useSyncedState } from "../shared/SharedHooks";
import { useRecoilState } from "recoil";
import clickedAddItem from "../../statesManager/clickedAdd";
import projectCompleted from "../../statesManager/projectCompleted";

const generateId = () => Date.now().toString();

const TaskboardRoot = styled.div`
  min-height: 0;
  height: 100%;
  min-width: 800px;
  max-width: 1400px;
  margin: auto;
`;

const TaskboardContent = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
`;

const defaultItems = {
  [TaskboardItemStatus.TO_DO]: [],
  [TaskboardItemStatus.IN_PROGRESS]: [],
  [TaskboardItemStatus.DONE]: [],
};

function Taskboard() {
  let newTaskArray = [];
  const [projectDone] = useRecoilState(projectCompleted);
  const [itemsByStatus, setItemsByStatus] = useSyncedState(
    "itemsByStatus",
    defaultItems
  );
  const [clickedOnDashButton] = useState(
    localStorage.getItem("clickedOnDashButton") ?? false
  );

  const [DoneAlert] = useState(
    localStorage.getItem("DoneAlert") !== null ? true : false
  );

  useEffect(() => {
    if (
      projectDone &&
      itemsByStatus["In Progress"].length === 0 &&
      itemsByStatus["To Do"].length === 0 &&
      localStorage.getItem("DoneAlert") === null
    ) {
      localStorage.setItem("DoneAlert", true);
    }

    if (!projectDone) {
      localStorage.removeItem("DoneAlert");
    }
    

    if (projectDone && newTaskArray) {
      const counts = newTaskArray[0]
        .map((resu) => resu.cardTitle)
        .reduce(
          (acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1,
          }),
          {}
        );
      localStorage.setItem("counts", JSON.stringify(counts));
    }
  }, [projectDone, clickedOnDashButton, DoneAlert, itemsByStatus]);

  const handleDragEnd = ({ source, destination }) => {
    
      setItemsByStatus((current) =>
        produce(current, (draft) => {
          if (!destination) {
            return;
          }
          const [removed] = draft[source.droppableId].splice(source.index, 1);
          draft[destination.droppableId].splice(destination.index, 0, removed);
        })
      );
    
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [itemToEdit, setItemToEdit] = useState(null);

  const openTaskItemModal = (itemToEdit) => {
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const closeTaskItemModal = () => {
    setItemToEdit(null);
    setIsModalVisible(false);
    setClickedAddButton(false);
  };

  const handleDelete = ({ status, itemToDelete }) =>
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        draft[status] = draft[status].filter(
          (item) => item.id !== itemToDelete.id
        );
      })
    );

  const initialValues = useMemo(
    () => ({
      timestamp: itemToEdit?.timestamp ?? "",
      title: itemToEdit?.title ?? "",
      description: itemToEdit?.description ?? "",
      startWork: 0,
      stopWork: 0,
      totalTime: 0,
    }),
    [itemToEdit]
  );

  const [clickedAddButton, setClickedAddButton] =
    useRecoilState(clickedAddItem);


  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskboardRoot>
          {itemsByStatus["In Progress"].length === 0 &&
          itemsByStatus["To Do"].length === 0
          }
          <TaskboardContent>
            {Object.values(TaskboardItemStatus).map((status) => (
              <TaskboardCol
                key={status}
                status={status}
                items={itemsByStatus[status]}
                itemsByStatus={itemsByStatus}
                setItemsByStatus={setItemsByStatus}
                onClickAdd={
                  status === TaskboardItemStatus.TO_DO
                    ? () => {
                        openTaskItemModal(null);
                        setClickedAddButton(true);
                      }
                    : undefined
                }
                setClickedAddButton={setClickedAddButton}
                clickedAddButton={clickedAddButton}
                onEdit={openTaskItemModal}
                onDelete={handleDelete}
              />
            ))}
          </TaskboardContent>
        </TaskboardRoot>
      </DragDropContext>

      <TaskboardItemModal
        visible={isModalVisible}
        onCancel={closeTaskItemModal}
        onOk={(values) => {
          setItemsByStatus((current) =>
            produce(current, (draft) => {
              // console.log("current", current);
              if (itemToEdit) {
                const draftItem = Object.values(draft)
                  .flatMap((items) => items)
                  .find((item) => item.id === itemToEdit.id);
                if (draftItem) {
                  draftItem.title = values.title;
                  draftItem.description = values.description;
                  draftItem.startWork = values.startWork;
                }
              } else {
                draft[TaskboardItemStatus.TO_DO].push({
                  ...values,
                  id: generateId(),
                });
              }
            })
          );
        }}
        initialValues={initialValues}
      />
    </>
  );
}

export default Taskboard;
