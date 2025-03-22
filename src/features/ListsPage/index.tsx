import { useAppSelector } from "../../hooks";
import { ListsList } from "./ListsList";
import { ListsButtons } from "./ListsButtons";
import { TasksList } from "./TasksList";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import {
  selectAreListsEmpty,
  selectSelectedListId,
  selectSelectedListById,
} from "./listsSlice";

const ListsPage = () => {
  const areListsEmpty = useAppSelector(selectAreListsEmpty);
  const selectedListId = useAppSelector(selectSelectedListId);
  const selectedListById = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );

  return (
    <>
      <Header title="Zapisane listy" />
      <Section
        title={areListsEmpty ? "Nie masz zapisanych list 😯" : "Wybierz listę"}
        body={<ListsList />}
        extraHeaderContent={<ListsButtons />}
      />
      {selectedListById !== null && (
        <>
          <Header title="Wybrana lista" />
          <Section
            title={selectedListById.name}
            body={<TasksList list={selectedListById.taskList} />}
          />
        </>
      )}
    </>
  );
};

export default ListsPage;
