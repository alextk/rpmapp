class MigrateMmasToJournalEntries < ActiveRecord::Migration
  def self.up
    categories_map = {
      :a => JournalEntryCategory.create!(
        :name => 'הישגים',
        :icon => 'achievements-32x32.png',
        :default_entry_name => 'סיכום יומי של הישגים'
      ),
      :mm => JournalEntryCategory.create!(
        :name => 'רגעים מיוחדים',
        :icon => 'magic_moments-32x32.png',
        :default_entry_name => 'סיכום יומי של רגעים מיוחדים'
      ),
      :gt => JournalEntryCategory.create!(
        :name => 'מחשבות',
        :icon => 'general_thoughts-32x32.png',
        :default_entry_name => 'מחשבות וכאלה'
      )
    }

    MagicMomentsAchievementsLog.order('date asc').each do |mma|
      c = categories_map[:a]
      JournalEntry.create!(:name => c.default_entry_name, :description => mma.achievements, :date => mma.date, :category => c)
      c = categories_map[:mm]
      JournalEntry.create!(:name => c.default_entry_name, :description => mma.magic_moments, :date => mma.date, :category => c)
      if mma.general_thoughts.present?
        c = categories_map[:gt]
        JournalEntry.create!(:name => c.default_entry_name, :description => mma.general_thoughts, :date => mma.date, :category => c)
      end
    end
  end

  def self.down
    JournalEntryCategory.destroy_all
    JournalEntry.destroy_all
  end
end
