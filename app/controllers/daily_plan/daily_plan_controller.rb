class DailyPlan::DailyPlanController < ApplicationController

  before_filter :init_current_daily_plan

  def init_current_daily_plan
    @daily_plan = ::DailyPlan.find(params[:daily_plan_id])
  end

end
