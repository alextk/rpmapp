class RpmBlocksController < ApplicationController

  def index
    init_data_grid
  end

  def grid_api
    init_data_grid
  end

  def modify_completion
    @rpm_block = RpmBlock.find(params[:id])
    @rpm_block.update_attributes(:completed => params[:completed])
  end

  def new
    @rpm_block = RpmBlock.new
  end

  def create
    @rpm_block = RpmBlock.new
    @rpm_block.update_attributes(params[:rpm_block])
  end

  def edit
    @rpm_block = RpmBlock.find(params[:id])
  end

  def update
    @rpm_block = RpmBlock.find(params[:id])
    @rpm_block.update_attributes(params[:rpm_block])
  end

  def destroy
    @rpm_block = RpmBlock.find_by_id(params[:id])
    @rpm_block.destroy if @rpm_block.present? && (params[:approved]=='true' || @rpm_block.daily_plan_assocs.blank?) # destroy rpm_block if approved or it does not belong to any daily plans
  end

  def duplicate
    @source_rpm_block = RpmBlock.find(params[:id])
    @rpm_block = RpmBlock.create(@source_rpm_block.attributes.slice(*%w[result purpose actions]))
  end

  private
  def init_data_grid
    @dgc = AjaxDataGrid::Config.new({ :params => params, :sort_by => 'created_at', :sort_direction => 'desc', :any_rows => RpmBlock.any?, :paging_page_size => 25, :per_page_sizes => [10, 25, 50, 100, 200, 500, 1000],
                                      :filter_free_text => '',
                                      :filter_completed => 'false', :filter_has_future_daily_plan => 'all', :filter_has_future_weekly_plan => 'all'
                                    })

    rpm_blocks = RpmBlock.includes(:daily_plans, :weekly_plans)
    rpm_blocks = rpm_blocks.search(@dgc.options.filter_free_text) if @dgc.options.filter_free_text.present?  #filter by free text
    rpm_blocks = rpm_blocks.where(:completed => @dgc.options.filter_completed) if @dgc.options.filter_completed != 'all'

    if @dgc.options.filter_has_future_daily_plan == 'true'
      rpm_blocks = rpm_blocks.where('daily_plans.date >= ?', Time.now.to_date)
    elsif @dgc.options.filter_has_future_daily_plan == 'false'
      rpm_blocks = rpm_blocks.where('daily_plans.date < ? OR daily_plans.id is ?', Time.now.to_date, nil)
    end

    if @dgc.options.filter_has_future_weekly_plan == 'true'
      rpm_blocks = rpm_blocks.where("date(weekly_plans.start_date + interval '6 days') >= ?", Time.now.to_date)
    elsif @dgc.options.filter_has_future_weekly_plan == 'false'
      rpm_blocks = rpm_blocks.where("date(weekly_plans.start_date + interval '6 days') < ? OR weekly_plans.id is ?", Time.now.to_date, nil)
    end

    @dgc.init_model(rpm_blocks)
  end

end
