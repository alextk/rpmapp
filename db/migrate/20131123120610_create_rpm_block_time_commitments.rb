class CreateRpmBlockTimeCommitments < ActiveRecord::Migration
  def self.up
    create_table :rpm_block_time_commitments do |t|
      t.references :rpm_block, :daily_plan
      t.timestamp :start_at, :end_at
      t.string :notes
      t.timestamps
    end
  end

  def self.down
    drop_table :rpm_block_time_commitments
  end
end
