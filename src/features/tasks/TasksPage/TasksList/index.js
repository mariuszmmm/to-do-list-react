import { useSelector, useDispatch } from "react-redux";
import { selectHideDone, toggleTaskDone, editTask, removeTasks, selectTasksByQuery, selectEditedTask, setTasks } from "../../tasksSlice";
import { List, Item, Content, Task, StyledLink } from "./styled";
import { useQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";
import { formatCurrentDate } from "../../../../utils/formatCurrentDate";
import { useEffect } from "react";
import { selectListToDownload, setListToDownload } from "../../../ListsPage/listsSlice";
import { EditButton, RemoveButton, ToggleButton } from "../../../../common/buttons";

const TasksList = () => {
  const query = useQueryParameter(searchQueryParamName);
  const tasks = useSelector(state => selectTasksByQuery(state, query));
  const hideDone = useSelector(selectHideDone);
  const editedTask = useSelector(selectEditedTask);
  const listToDownload = useSelector(selectListToDownload);
  const dispatch = useDispatch();
  const date = formatCurrentDate(new Date());

  useEffect(() => {
    if (listToDownload !== null) {
      dispatch(setTasks({ tasks: listToDownload.list, lastTasks: tasks }));
      dispatch(setListToDownload(null))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listToDownload]);

  return (
    <List >
      {tasks.map((task, index) => (
        <Item
          key={task.id}
          hidden={task.done && hideDone}
          edit={editedTask?.id === task.id}
        >
          <ToggleButton
            onClick={() => dispatch(toggleTaskDone({ taskId: task.id, doneDate: task.done ? null : date, lastTasks: tasks }))}
            disabled={editedTask !== null}
          >
            {task.done ? "✔" : ""}
          </ToggleButton>
          <Content>
            {(!query) ? <span>{index + 1}. </span> : ""}
            <Task done={task.done}>
              <StyledLink to={`/zadania/${task.id}`}>{task.content}</StyledLink>
            </Task>
          </Content>
          <EditButton
            onClick={() => dispatch(editTask(task.id))}
            disabled={editedTask !== null}
          >
            ✏️
          </EditButton>
          <RemoveButton
            onClick={() => dispatch(removeTasks({ taskId: task.id, lastTasks: tasks }))}
            disabled={editedTask !== null}
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};

export default TasksList;