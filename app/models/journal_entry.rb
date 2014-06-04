class JournalEntry < ActiveRecord::Base
  acts_as_searchable :name, :description
  date_attr_writer :date

  belongs_to :category, :class_name => 'JournalEntryCategory', :foreign_key => :journal_entry_category_id

  validates_presence_of :date, :name, :description, :journal_entry_category_id

end
