import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "./App.css"
import Residence from './Components/Admin/ResidentManage/ResidentHome/Residence'
import { Form } from './Components/Admin/ResidentManage/ResidentForms/ResidentOwner,Tenant/Form'
import MemberList from './Components/Resident/MaintenanceDetails/MemberList'
import Upersonaldetail from './Components/Resident/PersonelDetail/Upersonaldetail'
import UMaintenace from './Components/Resident/Maintance/UMaintenace'
import UOtherincome from './Components/Resident/PaymentPortal/OtherIncomeInvoice/UOtherincome'
import UsecurityProtocol from './Components/Resident/SecurityProtocols/UsecurityProtocol'
import Uviw from './Components/Resident/PaymentPortal/MaintenanceInvoices/Uview'
import UcardDetail from './Components/Models/UcardDetail'
import UpaymentCard from './Components/Models/UpaymentCard'

import SemergencyManagment from './Components/Security/SecurityEmergencyManagement/SemergencyManagment'
import Svisitor from './Components/Security/SecurityVisitor/Svisitor'
import Uchat from './Components/Resident/Community/AccessForums/Uchat'
import Upools from './Components/Resident/Community/Polls/Upools'
import Uevents from './Components/Resident/Participation/EventsParticipation/Uevents'

import RegistrationPage from './Components/Auth/Admin/Registration/RegistrationPage'
import Login from './Components/Auth/Admin/Login/Login'
import ForgetPassword from './Components/Auth/AuthCommon/ForgetPassword/ForgetPassword'
import OtpVerification from './Components/Auth/AuthCommon/OtpVerification/OtpVerification'
import ResetPassword from './Components/Auth/AuthCommon/ResetPassword/ResetPassword'
import Update from './Components/Admin/Profile/UpdateProfile/Update'
import AddMaintain from './Components/Models/AddMaintain'
import FinanceManagment from './Components/Admin/Finance/FinanceIncome/Income/FinanceManagment'
import OtherIncome from './Components/Admin/Finance/FinanceIncome/OtherIncome/OtherIncome'
import Note from './Components/Admin/Finance/FinanceNote/Note'
import Facilitymanagment from './Components/Admin/Facility/Facilitymanagment'
import Announcment from './Components/Admin/Announcement/Announcment'
import CreateComplain from './Components/Admin/Complain/AdminComplainTracking/CreateComplain'
import RequestTracking from './Components/Admin/Complain/AdminRequestTracking/RequestTracking'
import VisitorsLogs from './Components/Admin/SecurityManage/SecurityVisitorLog/VisitorsLogs'
import SecurityProtocols from './Components/Admin/SecurityManage/SecurityProtocols/SecurityProtocols'
import SecurityGuard from './Components/Admin/SecurityGuard/SecurityGuard'
import ExpenseTracker from './Components/Admin/Finance/FinanceExpence/Expance'
import UserLogin from './Components/Auth/Resident/Login/UserLogin'
import UAside from './Components/Common/SideBar/ResidentSideBar/UAside'
import Udashboard from './Components/Dashboard/ReidentDashnoard/Udashboard'
import SLogin from './Components/Auth/Security/Login/SLogin'
import Ucommunity from './Components/Resident/Community/Discussion/Ucommunity'
import DashboardLayout from './Components/Dashboard/AdminDashboard/DashboardLayout'
import Editprofile from './Components/Admin/Profile/EditProfile/Editprofile'
import ComplaintSubmission from './Components/Resident/ServiceAndComplaint/ComplaintSubmission/ComplaintSubmission'
import RequestSubmission from './Components/Resident/ServiceAndComplaint/RequestSubmission/RequestSubmission'
// import ZegoRoom from './ZegoRoom'


function App() {
  return (
    <div className="App">
      {/* <Aside/> */}
      <div className="">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<RegistrationPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/password' element={<ForgetPassword />} />
            <Route path='/otp' element={<OtpVerification />} />
            <Route path='/reset' element={<ResetPassword />} />
            <Route path='/addmain' element={<AddMaintain />} />
         

            // Admin routes
            <Route path='/admin'>
              <Route path='dashboard' element={<DashboardLayout />} />
              <Route path='editprofile' element={<Editprofile />} />
              <Route path='update' element={<Update />} />
              <Route path='residence' element={<Residence />} />
              <Route path='form' element={<Form />} />
              <Route path='financial' element={<FinanceManagment />} />
              <Route path='otherincome' element={<OtherIncome />} />
              <Route path='memberlist/:id' element={<MemberList />} />
              <Route path='note' element={<Note />} />
              <Route path='Facilitymanagment' element={<Facilitymanagment />} />
              <Route path='announcment' element={<Announcment />} />
              <Route path='Createcomplain' element={<CreateComplain />} />
              <Route path='requesttracking' element={<RequestTracking />} />
              <Route path='visitorslogs' element={<VisitorsLogs />} />
              <Route path='securityprotocols' element={<SecurityProtocols />} />
              <Route path='securityguard' element={<SecurityGuard />} />
              <Route path='expance' element={<ExpenseTracker />} />
            </Route>

            //user routes
            <Route path='/user'>
              <Route path='login' element={<UserLogin />} />
              <Route path='aside' element={<UAside />} />
              <Route path='udashboard' element={<Udashboard />} />
              <Route path='upersonaldetail' element={<Upersonaldetail />} />
              <Route path='Maintenace' element={<UMaintenace />} />
              <Route path='Uview' element={<Uviw />} />
              <Route path='Ucard' element={<UcardDetail />} />
              <Route path='Upaymentcard' element={<UpaymentCard />} />
              <Route path='otherincome' element={<UOtherincome />} />
              <Route path='usecurityprotocol' element={<UsecurityProtocol />} />
              <Route path='uchat' element={<Uchat />} />
              <Route path='upools' element={<Upools />} />
              <Route path='uevents' element={<Uevents />} />
              <Route path='ucommunity' element={<Ucommunity />} />
              <Route path='ucomplaintSubmission' element={<ComplaintSubmission />} />
              <Route path='urequestsubmission' element={<RequestSubmission />} />
            </Route>

            //security routes
            <Route path="/security">
              <Route path='Slogin' element={<SLogin />} />
              <Route path='Semergency' element={<SemergencyManagment />} />
              <Route path='Svisitor' element={<Svisitor />} />
            </Route>

          </Routes>
        </BrowserRouter>

      </div>

    </div>
  )
}

export default App