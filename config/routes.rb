MyRpm::Application.routes.draw do

  devise_for :admin_users, :path => '', :class_name=>'AdminUser', :controllers=>{:sessions=>'sessions'}, :skip => [:passwords, :registrations, :confirmations]

  root :to => 'home#show'
  resource :home, :only => :show, :controller => 'home' do
  end

  resources :journal_entries do
    get :day_view, :month_view, :grid_api, :on => :collection
  end

  resources :journal_entry_categories do
    get :grid_api, :on => :collection
  end

  resources :snippets, :except => [] do
    get :grid_api, :on => :collection
  end

  resources :snippets_lists, :except => [] do
    get :grid_api, :on => :collection

    resources :snippets, :except => [:show], :controller => 'snippets_list/snippets' do
      get :duplicate, :on => :member
      post :update_positions, :on => :collection
    end
  end

  resources :rpm_blocks, :except => [:show] do
    get :grid_api, :on => :collection
    post :modify_completion, :duplicate, :on => :member

    resources :plan_assocs, :controller => 'rpm_block/plan_assocs', :only => %w(new) do
      get :new_in_plan, :on => :collection
    end

    resources :daily_plan_assocs, :controller => 'rpm_block/daily_plan_assocs', :only => %w(create) do
    end

    resources :weekly_plan_assocs, :controller => 'rpm_block/weekly_plan_assocs', :only => %w(create) do
    end
  end

  resources :daily_plans, :only => [:new, :create] do
    get :day_view, :on => :collection

    resources :rpm_blocks, :controller => 'daily_plan/rpm_blocks', :only => %w(new create edit update destroy) do
      post :modify_completion, :duplicate, :on => :member
    end
    resources :rpm_block_assocs, :controller => 'daily_plan/rpm_block_assocs', :only => %w(new create destroy) do
      post :update_positions, :on => :collection

      resources :time_commitments, :controller => 'daily_plan/rpm_block_assoc/time_commitments', :only => %w(new create edit update destroy) do
      end
    end
  end

  resources :weekly_plans, :only => [:create] do
    get :week_view, :on => :collection
    resources :rpm_blocks, :controller => 'weekly_plan/rpm_blocks', :only => %w(new create edit update destroy) do
      post :modify_completion, :duplicate, :on => :member
    end
    resources :rpm_block_assocs, :controller => 'weekly_plan/rpm_block_assocs', :only => %w(new create destroy) do
      post :update_positions, :on => :collection
    end
  end

end
