import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt?: string;
};

interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
};

const API_URI='https://todo-app-redux-cs6w.onrender.com';

const initialState: TodoState = {
    todos: [],
    loading: false,
    error: null,
};

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async (_, { rejectWithValue }): Promise<Todo[]> => {
        try {
            const response = await fetch(`${API_URI}/data`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message) as unknown as Todo[];
            }
            return rejectWithValue('Unknown error') as unknown as Todo[];
        }
    }
);


export const asynsThink = createAsyncThunk(
    'todos/asynsThink',
    async (text: string, { rejectWithValue }): Promise<Todo> => {
        try {
            const response = await fetch(`${API_URI}/store`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, completed: false }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            
            const data = await response.json();
            return {
                id: data._id || data.id,
                text: data.text,
                completed: data.completed || false
            };
            
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message) as unknown as Todo;
            }
            return rejectWithValue('An unknown error occurred') as unknown as Todo;
        }
    }
);

export const removeTodo = createAsyncThunk(
    'todos/deleteTodo',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URI}/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            return id;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message) as unknown as string;
            }
            return rejectWithValue('An unknown error occurred') as unknown as string;
        }
    }
)

export const toggle = createAsyncThunk(
    'todos/toggleTodo',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URI}/toggle/${id}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error("Failed to toggle todo!");
            }

            return id;

        } catch (error) {
            console.error("Toggle error:", error); 
            return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
        }
    }
);


const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
                state.loading = false;
                state.todos = action.payload;
            })


            .addCase(asynsThink.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.loading = false;
                state.todos.push(action.payload);
            })

            .addCase(removeTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter((todo) => todo.id !== action.payload);
            })
            .addCase(toggle.fulfilled, (state, action: PayloadAction<string | undefined>) => {
                const todo = state.todos.find((t) => t.id === action.payload );
                if(todo) {
                    todo.completed = !todo.completed;
                }
            });
    }
    
});


export default todoSlice.reducer;







// interface Todo {
//     id: string;
//     text: string;
//     completed: boolean;
//     createdAt ?: string;
// };

// interface TodoState {
//     todos: Todo[];
//     loading: boolean;
//     error: string | null;
// };

// const initialState : TodoState = {
//     todos: [],
//     loading: false,
//     error: null,

// }

// const fetchTodos = async () => {
//     const response = await fetch('http://localhost:3001/data');
//     if (!response.ok) {
//         throw new Error('Failed to fetch data');
//     }
//     return await response.json();
// };
// fetchTodos();

// export const asynsThink = createAsyncThunk(
//     'todos/asynsThink',
//     async(text:string) => {
//         const response = await fetch('http://localhost:3001/store', {
//             method: "POST",
//             headers: { 'Content-Type' : 'application/json' },
//             body: JSON.stringify({ text, completed : false }),
//         });
//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }
//         return await response.json();
        
//     }
// )

// const todoSlice =  createSlice({
//     name: "todos",
//     initialState,
//     reducers: {
//         // addTodo: (state, action: PayloadAction<string>) => {
//         //     state.todos.push({
//         //         id: Date.now(),
//         //         text: action.payload,
//         //         completed: false,
//         //     });
//         // },

//         toggleTodo: (state, action: PayloadAction<string>) => {
//             const todo = state.todos.find((t) => t.id === action.payload);
//             if(todo) {
//                 todo.completed = !todo.completed;
//             };
//         },

//         deleteTodo: (state, action: PayloadAction<string>) => {
//             state.todos = state.todos.filter((t) => t.id !== action.payload);
//         } ,
//     },

//     extraReducers:(builder) => {
//        builder
//             .addCase(asynsThink.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(asynsThink.fulfilled, (state, action: PayloadAction<Todo>) => {
//                 state.loading = false;
//                 state.todos.push(action.payload);
//             })
//             .addCase(asynsThink.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Faild to Add todo';
//             } )
//     }
// });

// export const { toggleTodo, deleteTodo } = todoSlice.actions;
// export default todoSlice.reducer;