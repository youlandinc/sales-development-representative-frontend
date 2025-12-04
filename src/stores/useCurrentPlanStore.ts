import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { _fetchCurrentPlan } from '@/request';
import { CurrentPlanPlanInfoItem, PlanStatusEnum, PlanTypeEnum } from '@/types';

const SEND_EMAIL_PLAN_TYPES = new Set([
  PlanTypeEnum.research,
  PlanTypeEnum.intelligence,
  PlanTypeEnum.institutional,
  PlanTypeEnum.enterprise,
]);

interface CurrentPlanStoreState {
  planList: CurrentPlanPlanInfoItem[];
  isLoading: boolean;
  paidPlan: PlanTypeEnum[];
  sendEmailPlan: PlanTypeEnum[];
  cancelledPlan: PlanTypeEnum[];
}

interface CurrentPlanStoreActions {
  fetchCurrentPlan: () => Promise<void>;
}

type CurrentPlanStoreProps = CurrentPlanStoreState & CurrentPlanStoreActions;

export const useCurrentPlanStore = create<CurrentPlanStoreProps>()((set) => ({
  planList: [],
  isLoading: false,
  paidPlan: [],
  sendEmailPlan: [],
  cancelledPlan: [],
  fetchCurrentPlan: async () => {
    try {
      set({ isLoading: true });
      const response = await _fetchCurrentPlan();

      const { paidPlan, sendEmailPlan, cancelledPlan } =
        response.data.currentPlans.reduce(
          (acc, plan) => {
            const { planType, status } = plan;
            if (status === PlanStatusEnum.succeeded) {
              acc.paidPlan.push(planType);
            }
            if (status === PlanStatusEnum.cancelled) {
              acc.cancelledPlan.push(planType);
            }
            if (
              status === PlanStatusEnum.created &&
              SEND_EMAIL_PLAN_TYPES.has(planType)
            ) {
              acc.sendEmailPlan.push(planType);
            }
            return acc;
          },
          {
            paidPlan: [] as PlanTypeEnum[],
            sendEmailPlan: [] as PlanTypeEnum[],
            cancelledPlan: [] as PlanTypeEnum[],
          },
        );

      set({
        planList: response.data.currentPlans,
        paidPlan,
        sendEmailPlan,
        cancelledPlan,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
