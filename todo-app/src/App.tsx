import AddTodo from "./Components/AddTodo";
import TodoList from "./Components/TodoList";
import { store } from "./redux/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="text-lg md:text-xl font-serif max-w-full lg:max-w-md xl:max-w-lg min-h-screen mx-auto mt-0 xl:mt-10 border-4 border-gray-300 shadow-md bg-gradient-to-r from-blue-100 to-purple-50  text-black rounded-xl">
        <AddTodo />
        <TodoList />
      </div>
    </Provider>
  );
}

export default App;
