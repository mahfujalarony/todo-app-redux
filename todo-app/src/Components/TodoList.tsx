import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { toggle } from "../redux/todoSlice";
import { useEffect } from "react";
import { fetchTodos } from "../redux/todoSlice";
import { removeTodo } from "../redux/todoSlice";

const TodoList = () => {
    const todos = useSelector((state: RootState) => state.todo.todos);
    console.log("todos", todos);
    const dispatch = useDispatch<AppDispatch>();

  
    useEffect(() => {
      dispatch(fetchTodos()); 
  }, [dispatch]);

  return (
    <div className="flex flex-col px-8 gap-3 justify-center mt-5 mb-5">
      {todos?.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-2"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggle(todo.id))}
              className="w-5 h-5 accent-blue-500"
            />
            <span
              className={`text-lg ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.text}
            </span>
          </div>
  
          <button
            onClick={() => dispatch(removeTodo(todo.id))}
            className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
  
}

export default TodoList
