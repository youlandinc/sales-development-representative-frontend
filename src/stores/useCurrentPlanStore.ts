import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { _fetchCurrentPlan } from '@/request';
import { CurrentPlanPlanInfoItem, PlanStatusEnum, PlanTypeEnum } from '@/types';

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

      const paidPlan = response.data.currentPlans
        .filter((plan) => plan.status === PlanStatusEnum.succeeded)
        .map((plan) => plan.planType);

      const sendEmailPlan = response.data.currentPlans
        .filter(
          (plan) =>
            [
              PlanTypeEnum.research,
              PlanTypeEnum.intelligence,
              PlanTypeEnum.institutional,
              PlanTypeEnum.enterprise,
            ].includes(plan.planType) && plan.status === PlanStatusEnum.created,
        )
        .map((plan) => plan.planType);

      const cancelledPlan = response.data.currentPlans
        .filter((plan) => plan.status === PlanStatusEnum.cancelled)
        .map((plan) => plan.planType);

      set({
        planList: response.data.currentPlans,
        paidPlan,
        sendEmailPlan,
        cancelledPlan,
      });
      set({ isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
