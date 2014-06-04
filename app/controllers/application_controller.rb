class ApplicationController < ActionController::Base
  protect_from_forgery

  # Ensures only authenticated users with the right permissions can access backend.
  before_filter :login_required

  # Ensures each action is accessible only for authorized users.
  def login_required
    access_denied unless authorized?
  end

  # Defines the authorization mechanism for the backend.
  def authorized?
    logger.warn "--------------------\n\n Devise.timeout_in=#{Devise.timeout_in} \n"
    has_access = admin_user_signed_in?
    if has_access
      has_access = current_admin_user.access_allowed_from_ip?(request.ip)
      logger.info("denied access to account ##{current_admin_user.id} from #{request.ip}") unless has_access
    end
    has_access
  end

  # Defines the mechanism for handling unauthorized users.
  # If a user doesn't have an account he is redirected back to sign up page.
  # If a user has an account it means that it's either been locked or
  # he has not permissions to access the specific action .
  def access_denied
    if admin_user_signed_in? && !current_admin_user.access_allowed_from_ip?(request.ip)
      sign_out(:admin_user)
      error_message = "אין הרשאה לגשת למערכת ממחשב #{request.ip}"
    else
      error_message = t('devise.failure.unauthenticated')
    end
    redirect_to_format(new_admin_user_session_path, :error_message => error_message, :devise_store_location => true, :http_status => 401)
  end

  # Defines were to send the users after successful sign out.
  def after_sign_out_path_for(resource_or_scope)
    new_admin_user_session_path
  end

  # Defines were to send the users after successful sign up.
  def after_sign_in_path_for(resource_or_scope)
    home_path
  end

  protected
  # redirect to given url with respond format (so when js request is made fbox is shown etc.)
  def redirect_to_format(url, options = {})
    respond_to do |format|
      format.html {
        flash[:error] = options[:error_message] if options[:error_message].present?
        devise_store_location if options[:devise_store_location]
        redirect_to url
      }
      format.fbox { render :partial => '_shared/fancybox_redirect', :locals => {:url => url, :error_message => options[:error_message]} }
      format.js { render :partial => '_shared/fancybox_redirect', :locals => {:url => url, :error_message => options[:error_message]} }
      format.json {
        opts = {:json => {:fboxHTML => render_to_string(:partial => '_shared/fancybox_redirect.fbox', :locals => {:url => url, :error_message => options[:error_message]}) }}
        opts[:status] = options[:http_status] if options[:http_status].present?
        render opts
      }
      format.any { redirect_to url }
    end
  end

  def devise_store_location
    session["admin_user_return_to"] = request.url if request.get? && request.format == :html
  end

end
