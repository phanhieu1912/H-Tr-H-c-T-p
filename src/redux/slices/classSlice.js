import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  data: [
    {
      question: "What is Git?",
      answers: [
        "A remote repository platform.",
        "A programming language.",
        "A version control system.",
        "A nickname for GitHub.",
      ],
      correctAnswer: "A version control system.",
    },
    {
      question: "What is JSX?",
      answers: [
        "A programming language",
        "A file format",
        "A syntax extension for JavaScript",
        "A syntax extension for Java",
      ],
      correctAnswer: "A syntax extension for JavaScript",
    },
    {
      question: "What is Node.js?",
      answers: [
        "A runtime environment for executing JavaScript code server-side",
        "A front-end framework for building user interfaces",
        "A database management system",
        "A scripting language for automating tasks",
      ],
      correctAnswer:
        "A runtime environment for executing JavaScript code server-side",
    },
  ],
};

export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = classSlice.actions;

export default classSlice.reducer;
