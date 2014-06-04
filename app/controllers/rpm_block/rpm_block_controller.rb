class RpmBlock::RpmBlockController < ApplicationController

  before_filter :init_current_rpm_block

  def init_current_rpm_block
    @rpm_block = ::RpmBlock.find(params[:rpm_block_id])
  end

end
