class CreateMagicMomentsAchievementsLogs < ActiveRecord::Migration
  def self.up
    create_table :magic_moments_achievements_logs do |t|
      t.date :date
      t.text :magic_moments, :achievements, :general_thoughts
      t.timestamps
    end
  end

  def self.down
    drop_table :magic_moments_achievements_logs
  end
end
