import React, { useEffect, useState } from "react";
import { Button, Col, Popover } from "antd";
import { WrapperContentPopup, WrapperHeader } from "./style";
import Search from "antd/es/input/Search";
import { AudioOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { resetUser } from "../../redux/slices/userSlide";
import {UploadOutlined} from '@ant-design/icons'
export default function HeaderComponent() {
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );
  const navigate =useNavigate()
  const user =useSelector((state)=> state.user)
  const classTeacher =useSelector((state)=> state.class)
  const dispatch = useDispatch();
  const[userName ,setUserName] =useState('')
  // const[userAvatar ,setUserAvatar] =useState('')
  
  const handleLogout = async() =>{
    await UserService.logoutUser()
    dispatch(resetUser())
    navigate( '/')
  }
  const handleNavigateProfile =() =>{
    navigate( '/profile')
    
  }
  const handleNavigateHomePageTeacher =() =>{
    navigate( '/teacher')
    
  }
  const handleNavigateMyClass =() =>{
    navigate( '/myclass')
    
  }
  useEffect(()=>{
    setUserName(user?.name)
    // setUserAvatar(user?.avatar)
  },[user?.name ])
  const content =( 
 <div>
  <WrapperContentPopup onClick={handleLogout} >Đăng Xuất</WrapperContentPopup>
  <WrapperContentPopup onClick={handleNavigateProfile}>Profile</WrapperContentPopup>
  {user?.isTeacher && (
    <>
    <WrapperContentPopup onClick={handleNavigateHomePageTeacher}>HomePageTeacher</WrapperContentPopup>
    <WrapperContentPopup onClick={handleNavigateMyClass}>MyClass</WrapperContentPopup>
    </>
 
  )
   
  }
  
 </div>
  )
  const handleNavigateLogin =() =>{
    navigate( '/signin')
  }
  const handleNavigateSignup =() =>{
    navigate( '/signup')
  }

  const handleClickLogo = () => {
    navigate('/')
  }
  
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div>
      <WrapperHeader>
        <Col span={6} style={{color:'rgb(26,119,255)'}} className="d-flex align-items-center text-xl fw-bold">
          <button onClick={handleClickLogo}>LOGO</button>
        </Col>
        <Col span={12}>
          <Search
            placeholder="Hỏi bất cứ điều gì bạn muốn"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onSearch={onSearch}
          />
        </Col>
            {/* { userAvatar ? (
              <img src={userAvatar} alt="avatar" 
              style={{height:'30px',
              width:'30px',
              borderRadius:'50%',
              objectFit:'cover'}}/>
            ) : (
              <UploadOutlined style ={{fontSize:'30px'}}/>
             
            )} */}
        {user?.access_token ? (
          <>
          
          <Popover content={content} trigger="click">
          <div style={{cursor :'pointer' ,padding: '10px 10px 0px 100px'}}>{userName?.length? userName : user?.email}</div>
          </Popover>
          </>
          
        ):(
          <Col span={6} className="text-end">
          <Button onClick={handleNavigateSignup} style={{ height: "40px" }}>Đăng ký</Button>
          <Button onClick={handleNavigateLogin} type="primary" style={{ height: "40px" }}>
            Đăng nhập
          </Button>
          </Col>
        )}
        
          
        
      </WrapperHeader>
    </div>
  );
}
