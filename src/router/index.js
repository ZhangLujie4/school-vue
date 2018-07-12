import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Student from '@/components/Student'
import SBasicInfo from '@/components/student/BasicInfo'
import DataResource from '@/components/DataResource'
import stuSchedule from '@/components/student/Schedule'
import ChangePass from '@/components/ChangePass'
import stuClassMessage from '@/components/student/ClassMessage'
import OnlineSign from '@/components/student/OnlineSign'
import SchoolNews from '@/components/SchoolNews'
import NewsDetail from '@/components/NewsDetail'
import stuSendMessage from '@/components/student/SendMessage'
import stuRecordSign from '@/components/student/RecordSign'
import Teacher from '@/components/Teacher'
import TBasicInfo from '@/components/teacher/BasicInfo'
import SignIn from '@/components/teacher/SignIn'
import CallSign from '@/components/teacher/CallSign'
import teaSendMessage from '@/components/teacher/SendMessage'
import teaRecordSign from '@/components/teacher/RecordSign'
import teaSchedule from '@/components/teacher/Schedule'
import teaClassMessage from  '@/components/teacher/ClassMessage'
import Admin from '@/components/Admin'
import editNews from '@/components/admin/editNews'
import uploadExcel from '@/components/admin/uploadExcel'
import adminSchoolNews from '@/components/admin/adminSchoolNews'
import adminChangePass from '@/components/admin/ChangePass'
import updateTeacher from '@/components/admin/updateTeacher'
import updateStudent from '@/components/admin/updateStudent'
import updateNews from '@/components/admin/updateNews'
import addStudent from '@/components/admin/addStudent'
import editStudent from '@/components/admin/editStudent'
import addTeacher from '@/components/admin/addTeacher'
import editTeacher from '@/components/admin/editTeacher'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login
    },{
      path: '/student',
      name: '学生主页',
      component: Student, children: [
        {
          path: '/stuBasicInfo',
          name: '学生基本信息',
          component: SBasicInfo
        },{
          path:'/stuDataResource',
          name: '学生资源上传下载',
          component: DataResource
        },{
          path: '/stuSchedule',
          name: '学生班级课表',
          component: stuSchedule
        },{
          path: '/stuChangePass',
          name: '学生改密码',
          component: ChangePass
        },{
          path: '/stuClassMessage',
          name: '学生班级通知',
          component: stuClassMessage
        },{
          path: '/stuOnlineSign',
          name: '学生在线签到',
          component: OnlineSign
        },{
          path: '/stuSchoolNews',
          name: '学生学校新闻',
          component: SchoolNews
        },{
          path: '/stuNewsDetail',
          name: '学生新闻详情',
          component: NewsDetail
        },{
          path: '/stuSendMessage',
          name: '学生发送消息',
          component: stuSendMessage
        },{
          path: '/stuRecordSign',
          name: '学生个人签到情况',
          component: stuRecordSign
        }
      ]
    },{
      path: '/teacher',
      name: '教师主页',
      component: Teacher, children: [
        {
          path: '/teaDataResource',
          name: '资源上传下载',
          component: DataResource
        },{
          path: '/teaBasicInfo',
          name: '教师基本信息',
          component: TBasicInfo
        },{
          path: '/teaSchoolNews',
          name: '教师学校新闻',
          component: SchoolNews
        },{
          path: '/teaNewsDetail',
          name: '教师新闻详情',
          component: NewsDetail
        },{
          path: '/teaChangePass',
          name: '教师改密码',
          component: ChangePass
        },{
          path: '/teaSignIn',
          name: '在线签到',
          component: SignIn
        },{
          path: '/teaCallSign',
          name: '教师点到',
          component: CallSign
        },{
          path: '/teaSendMessage',
          name: '教师发送信息',
          component: teaSendMessage
        },{
          path: '/teaRecordSign',
          name: '教师查询签到情况',
          component: teaRecordSign
        },{
          path: '/teaSchedule',
          name: '教师课表',
          component: teaSchedule
        },{
          path: '/teaClassMessage',
          name: '教师班级通知',
          component: teaClassMessage
        }
      ]
    },{
      path: '/admin',
      name: '管理员主页',
      component: Admin, children: [
        {
          path: '/editNews',
          name: '编辑新闻',
          component: editNews
        },{
          path: '/uploadExcel',
          name: '上传Excel',
          component: uploadExcel
        },{
          path: '/adminSchoolNews',
          name: '管理员学校新闻',
          component: adminSchoolNews
        },{
          path: '/adminChangePass',
          name: '管理员改密码',
          component: adminChangePass
        },{
          path: '/updateTeacher',
          name: '编辑教师用户',
          component: updateTeacher
        },{
          path: '/updateStudent',
          name: '编辑学生用户',
          component: updateStudent
        },{
          path: '/updateNews',
          name: '更新新闻',
          component: updateNews
        },{
          path: '/addStudent',
          name: '添加学生',
          component: addStudent
        },{
          path: '/editStudent',
          name: '修改学生',
          component: editStudent
        },{
          path: '/addTeacher',
          name: '添加教师',
          component: addTeacher
        },{
          path: '/editTeacher',
          name: '修改教师',
          component: editTeacher
        }
      ]
    }
  ]
})
