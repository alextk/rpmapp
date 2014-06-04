class AdminUser < ActiveRecord::Base
  devise :database_authenticatable, :trackable, :validatable, :timeoutable
  attr_accessible :email, :password, :password_confirmation, :first_name, :last_name, :super_admin, :access_restricted_to_ips # Setup accessible (or protected) attributes for your model

  acts_as_searchable :first_name, :last_name, :email

  validates_presence_of :first_name, :last_name

  def full_name
    "#{first_name} #{last_name}"
  end

  def first_name=(value)
    value = value.strip if value.is_a?(String)
    write_attribute(:first_name, value)
  end

  def last_name=(value)
    value = value.strip if value.is_a?(String)
    write_attribute(:last_name, value)
  end

  def access_allowed_from_ip?(ip)
    self.access_restricted_to_ips.blank? || self.access_restricted_to_ips.split(',').map(&:strip).include?(ip)
  end
end
