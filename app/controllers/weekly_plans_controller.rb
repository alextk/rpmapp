class WeeklyPlansController < ApplicationController
  before_filter(:except => []) {
    params[:date] ||= Time.now.to_date.strftime('%Y-%m-%d')
    @beginning_of_week_date = WeeklyPlan.beginning_of_week_sunday(Date.parse(params[:date]))
    if params[:date] != @beginning_of_week_date.strftime
      redirect_to week_view_weekly_plans_path(:date => @beginning_of_week_date.strftime)
    end
  }

  def create
    if WeeklyPlan.where(:start_date => @beginning_of_week_date).blank?
      WeeklyPlan.create(:start_date => @beginning_of_week_date)
    end
    redirect_to week_view_weekly_plans_path(:date => @beginning_of_week_date.strftime)
  end

  def week_view
    @weekly_plan = WeeklyPlan.where(:start_date => @beginning_of_week_date).first
  end

end
