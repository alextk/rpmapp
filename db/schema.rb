# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140222091950) do

  create_table "admin_users", :force => true do |t|
    t.string   "email",                                   :default => "", :null => false
    t.string   "encrypted_password",       :limit => 128, :default => "", :null => false
    t.integer  "sign_in_count",                           :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "first_name"
    t.string   "last_name"
    t.text     "access_restricted_to_ips"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], :name => "index_admin_users_on_email", :unique => true

  create_table "daily_plans", :force => true do |t|
    t.date     "date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "journal_entries", :force => true do |t|
    t.integer  "journal_entry_category_id"
    t.date     "date"
    t.text     "name"
    t.text     "description"
    t.string   "category"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "journal_entries", ["journal_entry_category_id"], :name => "index_journal_entries_on_journal_entry_category_id"

  create_table "journal_entry_categories", :force => true do |t|
    t.string   "name"
    t.string   "default_entry_name"
    t.string   "icon"
    t.text     "description"
    t.text     "guiding_questions"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "magic_moments_achievements_logs", :force => true do |t|
    t.date     "date"
    t.text     "magic_moments"
    t.text     "achievements"
    t.text     "general_thoughts"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rpm_block_daily_plan_assocs", :force => true do |t|
    t.integer  "daily_plan_id"
    t.integer  "rpm_block_id"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rpm_block_time_commitments", :force => true do |t|
    t.integer  "daily_plan_id"
    t.datetime "start_at"
    t.datetime "end_at"
    t.string   "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "rpm_block_daily_plan_assoc_id"
  end

  create_table "rpm_block_weekly_plan_assocs", :force => true do |t|
    t.integer  "weekly_plan_id"
    t.integer  "rpm_block_id"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rpm_blocks", :force => true do |t|
    t.string   "result"
    t.text     "purpose"
    t.text     "actions"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "completed",    :default => false
    t.datetime "completed_at"
    t.text     "details"
  end

  create_table "snippets", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.text     "purpose"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "snippets_list_position", :default => 0
    t.integer  "snippets_list_id"
  end

  create_table "snippets_lists", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.text     "purpose"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "weekly_plans", :force => true do |t|
    t.date     "start_date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
