class SessionsController < ApplicationController

  skip_before_filter :login_required, :only => %w[new create destroy]
  before_filter :allow_params_authentication!, :only => :create
  include Devise::Controllers::InternalHelpers
  layout false

  # GET /resource/sign_in
  def new
    redirect_to home_path and return if authorized?
    clean_up_passwords(build_resource)
    resource.email = 'tkachev.alex@gmail.com' if resource.email.blank?
    render_with_scope :new
  end

  # POST /resource/sign_in
  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#new")

    set_flash_message(:notice, :signed_in)
    sign_in(:admin_user, resource)
    respond_with resource, :location => redirect_location(resource_name, resource)
  end


  # GET /resource/sign_out
  def destroy
    set_flash_message :notice, :signed_out if signed_in?(resource_name)
    sign_out_and_redirect(resource_name)
  end

end
