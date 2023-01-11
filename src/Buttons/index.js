import { ButtonsContainer, Button } from "./styled";

const Buttons = ({ tasks, hideDone, togglehideDone, setAllDone }) => (
	<ButtonsContainer>
		{tasks.length > 0 && (
			<>
				<Button
					onClick={togglehideDone}
				>
					{hideDone ? "Pokaż" : "Ukryj"} ukończone
				</Button>
				<Button
					onClick={setAllDone}
					disabled={tasks.every(({ done }) => done)}
				>
					Ukończ wszystkie
				</Button>
			</>
		)}
	</ButtonsContainer>
);

export default Buttons;