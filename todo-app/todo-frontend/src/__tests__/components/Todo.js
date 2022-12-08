import Todo from "../../Todos/Todo";
import { render, waitFor } from "@testing-library/react";

describe("Todo", () => {
    describe("Todo", () => {
        it("delete is called with correct arguments", async () => {
            const onDelete = jest.fn();
            const onComplete = jest.fn();
            const todo = {text: "Test todo", done: false }

            const { getByText } = render(<Todo todo={todo} deleteTodo={onDelete} completeTodo={onComplete}/>);

            const deleteButton = getByText("Delete");
            deleteButton.click();

            await waitFor(() => {
                expect(onDelete).toHaveBeenCalledTimes(1);
                expect(onDelete.mock.calls[0][0]).toEqual({
                    text: "Test todo",
                    done: false,
                });
            });
        });
    });
});