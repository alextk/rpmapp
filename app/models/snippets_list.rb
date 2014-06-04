class SnippetsList < ActiveRecord::Base

  has_many :snippets, :dependent => :destroy

  validates_presence_of :name

end
