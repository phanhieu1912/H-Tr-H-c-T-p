import axios from "axios";
import React, { Suspense, useState ,useEffect } from "react";
import * as message from  '../../components/MessageComponent/Message'
import { Container, Col, Row } from "react-bootstrap";
import * as QuestionService from '../../services/QuestionService'
import * as ClassService from '../../services/ClassService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {useDispatch} from 'react-redux'
import { Navigate, useParams } from "react-router-dom";



const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
  <span className="visually-hidden">Loading...</span>
</div>
    </div>
  );
};

export default function SearchQuestionByAI() {
  const classTeacher =useSelector((state)=> state.class)
  // const user =useSelector((state)=> state.user)
  const[classTeacherName ,setClassTeacherName] =useState('')
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const {id} = useParams()
  console.log("id class",id)
  // const[nameClass ,setNameClass]= useState(classTeacher?.questions)
  // const[description ,setDescription]= useState( user?.description)
  // const[classID ,setClassID]= useState(user?.classID)
  
  const dispatch =useDispatch()
  const mutation1 = useMutationHooks (
    (data) => {
        const{id, ...rests}=data
        ClassService.updateClass(id,rests)
    }
  )
  const {data , isSuccess ,isError} = mutation1
     useEffect(()=>{
        if(isSuccess && data?.status !== 'ERR'){
          message.success()
          handleGetDetailsClass(id)      
        }else if (isError){
          message.error()
        }
      },[isSuccess ,isError]
      )
      

      const handleGetDetailsClass =async(id )=>{
         await ClassService.getDetailClass(id)
        }
      //   dispatch(updateClass({...res?.data }))
       
  // const handleGetDetailsClass =async(id )=>{
  //   await ClassService.getDetailClass(id)
  // }
  // const classDetails = await ClassService.getDetailClass(id);
  //   console.log('Class Details:', classDetails);
  // dispatch(updateClass({...res?.data }))
  
//  useEffect(()=>{
//   setClassTeacherName(classTeacher._id)
//   setNameClass(classTeacher?.questions) 
  
//   // setAvatar(user?.avatar)
// },[classTeacher])
// console.log(setClassTeacherName)




 const handleUpdate =( ) =>{  
  
    mutation1.mutate({id ,questions })
  
  console.log("di me may2",classTeacher)
}

const mutation = useMutationHooks(parsedAnswer => {
  QuestionService.createQuestion(parsedAnswer);  
});
 const { mutate} = mutation

  async function generateAnswer() {
    setLoading(true)
    // setAnswer("loading...");
    const addText = `
    xin 10 câu hỏi trắc nghiệm về đoạn văn này theo format dưới đây
    [
    {
    "question": "Điền câu hỏi vào đây",
    "answers": [
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây."
    },
    {
    "question": "Điền câu hỏi vào đây",
    "answers": [
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây."
    },
    {
    "question": "Điền câu hỏi vào đây",
    "answers": [
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây."
    },
    ]
    `;
    const addText2 = `chỉnh lại cho chuẩn json`;

    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI",
      method: "POST",
      data: {
        contents: [{ parts: [{ text: question + addText }] }],
      },
    });

    setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]);

    const response2 = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI",
      method: "POST",
      data: {
        contents: [
          {
            parts: [
              {
                text:
                  response["data"]["candidates"][0]["content"]["parts"][0][
                    "text"
                  ] + addText2,
              },
            ],
          },
        ],
      },
    });

    const parsedAnswer = JSON.parse(
      response2["data"]["candidates"][0]["content"]["parts"][0]["text"]
    );

    setQuestions(parsedAnswer);
    mutate(parsedAnswer);
    console.log(parsedAnswer);
    console.log("di me may",classTeacher)
    // console.log('Class Details:', classDetails);
    // console.log(classTeacher1)
    setLoading(false)
  }

  function handleDeleteQuestion(index) {
    const updatedQuestions = questions.filter((_, questionIndex) => questionIndex !== index);
    setQuestions(updatedQuestions);
    console.log(questions)
  }

  return (
    <div className="home-page-teacher p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Chat AI</h1>
      <textarea
      className="question-input w-full h-40 p-2 mb-4 border rounded w-full"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="Nhập đoạn văn bạn muốn tạo ra câu hỏi"
    ></textarea>
    <button
      className="generate-button bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
      onClick={generateAnswer}
    >
      Generate answer
    </button>
    {loading ? (<Loading/>) : (<Container>
      {questions.map((questionn, key) => (
        <div>
          <Row>
            <Col xs={10}>
              <div className="mt-10">
                <Row>
                  <Col xs={12}>
                    <h2 className="text-left mb-4">Question: {questionn.question}</h2>
                  </Col>
                </Row>
                <Row className="">
                  {questionn.answers.map((answer, index) => (
                    <Col key={index} xs={6}>
                      <li
                        className="p-3 rounded-3 border border-info"
                        style={{
                          listStyleType: "none",
                          backgroundColor: "#c9dfff",
                        }}
                      >
                        <label>
                          <input
                            type="radio"
                            name="answer"
                            value={answer}
                          />
                          {answer}
                        </label>
                      </li>
                      <br />
                    </Col>
                  ))}
                </Row>
                <Row>
                  <Col xs={12}>
                    <p className="border-2 rounded-3 bg-green-200 p-2 text-left border-green-500">Correct answer: {questionn.correctAnswer}</p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              xs={1}
              className="d-flex align-items-center justify-content-center"
              onClick={() => handleDeleteQuestion(key)}
            >
              <button className="btn btn-danger">X</button>
            </Col>
          </Row>
        </div>
      ))}
    </Container>)}
    
    <button></button>
    <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"Add vào lớp học"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>


  </div>
);
}