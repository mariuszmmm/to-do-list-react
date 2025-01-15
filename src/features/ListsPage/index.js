import { useSelector } from "react-redux";
import Header from "../../common/Header";
import Section from "../../common/Section";
import { selectAreListsEmpty, selectSelectedListId, selectSelectedListById } from "./listsSlice";
import ListsList from "./ListsList";
import ListsButtons from "./ListsButtons";
import TasksList from "./TasksList";

const ListsPage = () => {
  const areListsEmpty = useSelector(selectAreListsEmpty)
  const selectedListId = useSelector(selectSelectedListId)
  const selecedListById = useSelector(state => selectSelectedListById(state, selectedListId))

  return (
    <>
      <Header title="Zapisane listy" />
      <Section
        title={areListsEmpty ? "Nie masz zapisanych list 😯" : "Wybierz listę"}
        body={<ListsList />}
        extraHeaderContent={<ListsButtons />}
      />
      {selecedListById?.list && <Section
        title={selecedListById.name}
        body={<TasksList list={selecedListById.list} />}
      />}
    </>
  );
};

export default ListsPage;