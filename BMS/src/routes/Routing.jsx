import { Routes, Route } from 'react-router-dom'

// requester
import MyRequest from '../pages/requester/MyRequest'
import ForLiquidation from '../pages/requester/ForLiquidation'
import MyLiquidations from '../pages/requester/MyLiquidations'
import CompletedLiquidations from '../pages/requester/CompletedLiquidations'
import VerifiedLiquidations from '../pages/requester/VerifiedLiquidations'

// team leader
import PendingApprovals from '../pages/teamLeader/PendingApprovals'
import ApprovedRequest from '../pages/teamLeader/ApprovedRequest'
import RejectedRequest from '../pages/teamLeader/RejectedRequest'
import ReviewLiquidations from '../pages/teamLeader/ReviewLiquidations'
import ReviewedLiquidations from '../pages/teamLeader/ReviewedLiquidations'
import RejectedLiquidations from '../pages/teamLeader/RejectedLiquidations'

// fund custodian
import ForProcessing from '../pages/fundCustodian/ForProcessing'
import Released from '../pages/fundCustodian/Released'
import Rejected from '../pages/fundCustodian/Rejected'
import VerifyLiquidations from '../pages/fundCustodian/VerifyLiquidations'
import Verified from '../pages/fundCustodian/Verified'
import RejectLiquidations from '../pages/fundCustodian/RejectLiquidations'

// finance
import BudgetAllocation from '../pages/fundCustodian/BudgetAllocation'
import RevolvingFund from '../pages/fundCustodian/RevolvingFund'
import CashDisbursement from '../pages/fundCustodian/CashDisbursement'
import FinanceApproval from '../pages/finance/FinanceApproval'
import FinanceComplete from '../pages/finance/FinanceComplete'
import FinanceReject from '../pages/finance/FinanceReject'
import AllRequest from '../pages/finance/AllRequest'

// admin
import Dashboard from '../pages/common/Dashboard'
import Users from '../pages/admin/Users'
import Access from '../pages/admin/Access'
import Stores from '../pages/admin/Stores'
import StoreRoutes from '../pages/admin/StoreRoutes'
import FlagAnalysis from '../pages/admin/FlagAnalysis'
import Transport from '../pages/admin/Transport'
import Particulars from '../pages/admin/Particulars'

const Routing = ({ sortKey, setSortKey, sortDirection, setSortDirection, handleSort }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            handleSort={handleSort}
          />
        }
      />
      <Route path="/users" element={<Users />} />
      <Route path="/access" element={<Access />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/particulars" element={<Particulars />} />
      <Route path="/flag-analysis" element={<FlagAnalysis />} />
      <Route path="/store-routes" element={<StoreRoutes />} />
      <Route path="/budget-allocation" element={<BudgetAllocation />} />
      <Route path="/revolving-fund" element={<RevolvingFund />} />
      <Route path="/cash-disbursement" element={<CashDisbursement />} />
      <Route path="/my-request" element={<MyRequest />} />
      <Route path="/for-liquidation" element={<ForLiquidation />} />
      <Route path="/pending-approvals" element={<PendingApprovals />} />
      <Route path="/approved-request" element={<ApprovedRequest />} />
      <Route path="/rejected-request" element={<RejectedRequest />} />
      <Route path="/for-processing" element={<ForProcessing />} />
      <Route path="/released" element={<Released />} />
      <Route path="/rejected" element={<Rejected />} />
      <Route path="/my-liquidations" element={<MyLiquidations />} />
      <Route path="/completed-liquidations" element={<CompletedLiquidations />} />
      <Route path="/verified-liquidations" element={<VerifiedLiquidations />} />
      <Route path="/review-liquidations" element={<ReviewLiquidations />} />
      <Route path="/reviewed-liquidations" element={<ReviewedLiquidations />} />
      <Route path="/rejected-liquidations" element={<RejectedLiquidations />} />
      <Route path="/reject-liquidations" element={<RejectLiquidations />} />
      <Route path="/verify-liquidations" element={<VerifyLiquidations />} />
      <Route path="/verified" element={<Verified />} />
      <Route path="/all-request" element={<AllRequest />} />
      <Route path="/finance-reject" element={<FinanceReject />} />
      <Route path="/finance-complete" element={<FinanceComplete />} />
      <Route path="/finance-approval" element={<FinanceApproval />} />
    </Routes>
  )
}

export default Routing
