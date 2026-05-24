import { Routes } from '@angular/router';

// Admin pages
import { Branch } from '@pages/admin/branch/branch';
import { LeaderList } from '@pages/admin/leader-list/leader-list';

// Common pages
import { BillClosing } from '@pages/common/bill-closing/bill-closing';
import { BillMaster } from '@pages/common/bill-master/bill-master';
import { CompletedDistributionList } from '@pages/common/completed-distribution-list/completed-distribution-list';
import { Hospital } from '@pages/common/hospital/hospital';
import { IncompleteDistributionList } from '@pages/common/incomplete-distribution-list/incomplete-distribution-list';
import { InvoiceConfirmationList } from '@pages/common/invoice-confirmation-list/invoice-confirmation-list';
import { Landing } from '@pages/common/landing/landing';
import { Login } from '@pages/common/login/login';
import { OptionList } from '@pages/common/option-list/option-list';
import { ROOM_LIST } from '@pages/common/room-list/room-list';
import { Service } from '@pages/common/service/service';
import { SetList } from '@pages/common/set-list/set-list';
import { SummaryList } from '@pages/common/summary-list/summary-list';
import { UserList } from '@pages/common/user-list/user-list';

// Hospital-staff pages
import { AfterDelivery } from '@pages/hospital-staff/after-delivery/after-delivery';
import { ClassificationList } from '@pages/hospital-staff/classification-list/classification-list';

// Leader pages

// Staff pages
import { DeliveryRequest } from '@pages/staff/delivery-request/delivery-request';

// Constants
import { RoleGuard } from '@services/auth/auth-guard';
import { GuestGuard } from '@services/auth/guest-guard';
import { PageGuard } from '@services/auth/page-guard';
import { RoleRedirectGuard } from '@services/auth/role-redirect.guard';
import { AppRoutes } from '@utils/constants';

export const routes: Routes = [
  {
    path: AppRoutes.DEFAULT,
    canActivate: [RoleRedirectGuard],
    component: Landing, // never actually renders
    pathMatch: 'full',
  },
  {
    path: AppRoutes.LANDING,
    canActivate: [GuestGuard],
    component: Landing,
  },
  {
    path: AppRoutes.LOGIN,
    canActivate: [GuestGuard],
    component: Login,
  },
  {
    path: AppRoutes.ADMIN,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.ADMIN },
    children: [
      {
        path: AppRoutes.ADMIN_CHILDREN.TOP,
        component: SummaryList,
        // home page — no page restriction to prevent redirect loops
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BRANCH,
        component: Branch,
        data: { page: 'branch-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.HOSPITAL,
        component: Hospital,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.HOSPITAL_WITH_LEADER,
        component: Hospital,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.ROOM_LIST,
        component: ROOM_LIST,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.LEADER_LIST,
        component: LeaderList,
        data: { page: 'leader-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SERVICE,
        component: Service,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.OPTION_LIST,
        component: OptionList,
        data: { page: 'option-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SET_LIST,
        component: SetList,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.USER_ADMIN_STAFF,
        component: UserList,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.USER_HOSPITAL_STAFF,
        component: UserList,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BILL_MASTER,
        component: BillMaster,
        data: { page: 'bill-master' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BILL_CLOSING,
        component: BillClosing,
        data: { page: 'bill-closing' },
      },
    ],
  },
  {
    path: AppRoutes.LEADER,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.LEADER },
    children: [
      {
        path: AppRoutes.LEADER_CHILDREN.SUMMARY,
        component: SummaryList,
        // home page — no page restriction
      },
      {
        path: AppRoutes.LEADER_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        component: CompletedDistributionList,
        data: { page: 'completed-distribution-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.INCOMPLETE_DISTRIBUTION_LIST,
        component: IncompleteDistributionList,
        data: { page: 'incomplete-distribution-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.HOSPITAL,
        component: Hospital,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.ROOM_LIST,
        component: ROOM_LIST,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.SERVICE,
        component: Service,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.OPTION_LIST,
        component: OptionList,
        data: { page: 'option-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.SET_LIST,
        component: SetList,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.USER_ADMIN_STAFF,
        component: UserList,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.USER_HOSPITAL_STAFF,
        component: UserList,
        data: { page: 'user-list' },
      },
    ],
  },
  {
    path: AppRoutes.STAFF,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.STAFF },
    children: [
      {
        path: AppRoutes.STAFF_CHILDREN.DELIVERY_REQUEST,
        component: DeliveryRequest,
        // home page — no page restriction
      },
      {
        path: AppRoutes.STAFF_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        component: CompletedDistributionList,
        data: { page: 'completed-distribution-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.INCOMPLETE_DISTRIBUTION_LIST,
        component: IncompleteDistributionList,
        data: { page: 'incomplete-distribution-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.USER_LIST,
        component: UserList,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.HOSPITAL,
        component: Hospital,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.ROOM_LIST,
        component: ROOM_LIST,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.SERVICE,
        component: Service,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.OPTION_LIST,
        component: OptionList,
        data: { page: 'option-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SET_LIST,
        component: SetList,
        data: { page: 'service-list' },
      },
    ],
  },
  {
    path: AppRoutes.HOSPITAL_STAFF,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.HOSPITAL_STAFF },
    children: [
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.AFTER_DELIVERY,
        component: AfterDelivery,
        // home page — no page restriction
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        component: CompletedDistributionList,
        data: { page: 'completed-distribution-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.USER_LIST,
        component: UserList,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.INVOICE_CONFIRMATION_LIST,
        component: InvoiceConfirmationList,
        data: { page: 'invoice-confirmation-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        component: ClassificationList,
        data: { page: 'hospital-staff-classification-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.OPTION_LIST,
        component: OptionList,
        data: { page: 'option-list' },
      },
    ],
  },
];
