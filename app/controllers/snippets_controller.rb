class SnippetsController < ApplicationController

  def index
    init_data_grid
  end

  def grid_api
    init_data_grid
  end

  def new
    @snippet = Snippet.new
  end

  def create
    @snippet = Snippet.new
    @snippet.update_attributes(params[:snippet])
  end

  def edit
    @snippet = Snippet.find(params[:id])
  end

  def update
    @snippet = Snippet.find(params[:id])
    @snippet.update_attributes(params[:snippet])
  end

  def destroy
    @snippet = Snippet.find_by_id(params[:id])
    @snippet.destroy if @snippet.present?
  end

  private
  def init_data_grid
    @dgc = AjaxDataGrid::Config.new({ :params => params, :sort_by => 'name', :sort_direction => 'asc', :any_rows => Snippet.any?, :paging_page_size => 25,
                                      :filter_free_text => ''
                                    })

    entries = Snippet.scoped
    entries = entries.search(@dgc.options.filter_free_text) if @dgc.options.filter_free_text.present?  #filter by free text
\
    @dgc.init_model(entries)
  end
end
