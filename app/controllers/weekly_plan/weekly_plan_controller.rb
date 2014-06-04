class WeeklyPlan::WeeklyPlanController < ApplicationController

  before_filter :init_current_weekly_plan

  def init_current_weekly_plan
    @weekly_plan = ::WeeklyPlan.find(params[:weekly_plan_id])
  end

end
