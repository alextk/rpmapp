class CreateRpmBlocks < ActiveRecord::Migration
  def self.up
    create_table :rpm_blocks do |t|
      t.references :daily_plan
      t.string :result
      t.text :purpose
      t.text :actions
      t.integer :position
      t.timestamps
    end
  end

  def self.down
    drop_table :rpm_blocks
  end
end
