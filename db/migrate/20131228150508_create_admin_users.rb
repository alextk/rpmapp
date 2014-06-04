class CreateAdminUsers < ActiveRecord::Migration
  def self.up
    create_table(:admin_users) do |t|
      t.database_authenticatable :null => false
      t.trackable
      # t.recoverable
      # t.rememberable
      # t.encryptable
      # t.confirmable
      # t.lockable :lock_strategy => :failed_attempts, :unlock_strategy => :both
      # t.token_authenticatable

      t.string :first_name, :last_name
      t.text :access_restricted_to_ips
      t.timestamps
    end

    #AdminUser.create!(:email => 'admin@example.com', :password => 'password', :password_confirmation => 'password')

    add_index :admin_users, :email,                :unique => true
    # add_index :admin_users, :reset_password_token, :unique => true
    # add_index :admin_users, :confirmation_token,   :unique => true
    # add_index :admin_users, :unlock_token,         :unique => true
    # add_index :admin_users, :authentication_token, :unique => true
  end

  def self.down
    drop_table :admin_users
  end
end
