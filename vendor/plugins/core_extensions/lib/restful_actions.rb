module ActionController
  module RestfulActions
    def self.included(base)
      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)
    end
    module ClassMethods
      def restful_actions(options={})

        options = {:entity_clazz=>self.controller_name.classify.constantize,
                   :respond_to=>[:html,:js],
                   :only=>[:index,:new,:edit,:update,:create,:show,:destroy],
                   :exclude=>[]}.update(options)
        options[:entity_name]=options[:entity_clazz].name.underscore.intern

        cattr_accessor :restful_actions_options
        self.restful_actions_options = options
        
        respond_to :html,:js       

        def include_restful_action?(action)            
          self.restful_actions_options[:only].include?(action) && !self.restful_actions_options[:exclude].include?(action)
        end
        
        self.class_eval do          
          def index
            @data_table = data_table('entities')
            @entities = self.restful_actions_options[:entity_clazz].data_table_find(:all,@data_table)
            render :action=>:index
          end if include_restful_action?(:index)
          def new
            @entity ||= self.restful_actions_options[:entity_clazz].new
            render :action=>:new
          end if include_restful_action?(:new)
          def create
            @entity ||= self.restful_actions_options[:entity_clazz].new
             new_record =  @entity.new_record?
            if @entity.update_attributes(params[self.restful_actions_options[:entity_name]])
              model_name = I18n.t("models.#{self.restful_actions_options[:entity_name]}")
              if new_record
                flash[:notice] = I18n.t('active_record.messages.created',:model=>model_name)
              else
                flash[:notice] = I18n.t('active_record.messages.updated',:model=>model_name)
              end
              #redirect_to url_for(:controller=>self.controller_name,:action=>:index)
              respond_with(@entity,:location=>{:action=>:index, :port=>request.port})
            else
              new
            end
          end if include_restful_action?(:create)
          def update
            @entity = self.restful_actions_options[:entity_clazz].find(params[:id])
            create
          end if include_restful_action?(:update)
          def edit
            @entity = self.restful_actions_options[:entity_clazz].find(params[:id])
            new           
          end if include_restful_action?(:edit)
          def show
            @entity = self.restful_actions_options[:entity_clazz].find(params[:id])
            respond_with(@entity)
          end if include_restful_action?(:show)
          def destroy
            flag = self.restful_actions_options[:entity_clazz].find(params[:id]).destroy
            if flag
              flash[:notice] = I18n.t('active_record.messages.destroyed',:model=>t("models.#{self.restful_actions_options[:entity_name]}"))
            else
              flash[:error] = I18n.t('active_record.error.unknown')
            end
            redirect_to :action=>:index, :port=>request.port
          end if include_restful_action?(:destroy)
        end
      end
    end
    module InstanceMethods
    end
  end
end
ActionController::Base.send(:include,ActionController::RestfulActions)