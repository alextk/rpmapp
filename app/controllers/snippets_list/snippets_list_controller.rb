class SnippetsList::SnippetsListController < ApplicationController

  before_filter :init_current_snippets_list

  def init_current_snippets_list
    @snippets_list = ::SnippetsList.find(params[:snippets_list_id])
  end

end
