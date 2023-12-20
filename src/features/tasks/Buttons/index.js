import { ButtonsContainer, Button } from "./styled";
import { selectTasksState, toggleHideDone, setAllDone, selectIsEveryTaskDone, selectAreTasksEmpty } from "../tasksSlice";
import { useSelector, useDispatch } from "react-redux";

const Buttons = () => {
   const { hideDone } = useSelector(selectTasksState);
   const areTasksEmpty = useSelector(selectAreTasksEmpty);
   const isEveryTaskDone = useSelector(selectIsEveryTaskDone);

   const dispatch = useDispatch();

   return (
      <ButtonsContainer>
         {!areTasksEmpty && (
            <>
               <Button
                  onClick={() => dispatch(toggleHideDone())}
               >
                  {hideDone ? "Pokaż" : "Ukryj"} ukończone
               </Button>
               <Button
                  onClick={() => dispatch(setAllDone())}
                  disabled={isEveryTaskDone}
               >
                  Ukończ wszystkie
               </Button>
            </>
         )}
      </ButtonsContainer>
   );
};

export default Buttons;