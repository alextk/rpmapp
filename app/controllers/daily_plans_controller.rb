class DailyPlansController < ApplicationController
  before_filter(:except => []) {
    params[:date] ||= Time.now.to_date.strftime('%Y-%m-%d')
    @day_date = Date.parse(params[:date])
  }

  def create
    if DailyPlan.where(:date => @day_date).blank?
      DailyPlan.create(:date => @day_date)
    end
    redirect_to day_view_daily_plans_path(:date => @day_date.strftime)
  end

  def day_view
    @daily_plan = DailyPlan.where(:date => @day_date).first
    redirect_to new_daily_plan_path(:date => @day_date.strftime) if @daily_plan.blank?
  end

  def new
    @daily_plan = DailyPlan.where(:date => @day_date).first
    redirect_to day_view_daily_plans_path(:date => @day_date.strftime) if @daily_plan.present?
  end

end
