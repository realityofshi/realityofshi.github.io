 jQuery( function( $ ) {
    elementor.hooks.addAction( 'panel/open_editor/widget/void-query-builder', function( panel, model, view ) {
        //call initially to set the already saved data
        void_grid_get_taxonomy();
       
        //function to get taxonomy based on post type 
        function void_grid_get_taxonomy( onload = true ){
            $('[data-setting="taxonomy_type"]').empty();
            //only trigger change to reset selected taxonomy option when post type is actively changed
            if( onload == false && event.type == 'change' ){
                //this is needed to reset the selected taxonomy
                $('[data-setting="taxonomy_type"]').trigger('change');
            }
            var post_type = $('[data-setting="post_type"]').val() || model.attributes.settings.attributes.post_type || [];
            var data = {
                action: 'voidquery_ajax_tax',
                postTypeNonce: voidquery_ajax.postTypeNonce,
                post_type: post_type
            };        
            $.post(voidquery_ajax.ajaxurl, data, function(response) {        
                var taxonomy_name = JSON.parse(response);          
                $.each(taxonomy_name,function(){
                    if(this.name == 'post_format'){
                        return;
                    }
                
                    $('[data-setting="taxonomy_type"]').append('<option value="'+this.name+'">'+this.name+'</option>'); 
                    
                });
                //set already selected value
                $('[data-setting="taxonomy_type"]').each( function( index, value ){
                    $(this).val( model.attributes.settings.attributes.tax_fields.models[index].attributes.taxonomy_type );
                    voidquery_terms($(this));
                });
                if( $('[data-setting="taxonomy_type"]').has('option').length == 0 ) {
                    $('[data-setting="taxonomy_type"]').attr('disabled', 'disabled');
                }else{
                    $('[data-setting="taxonomy_type"]').removeAttr('disabled');
                }
            });//$.post
        }//void_grid_get_taxonomy()

        //function to get terms based on taxonomy
        function voidquery_terms( onload = true ){
            //only trigger change to reset selected terms option when taxonomy is actively changed
            if( event.type == 'change' ){
                $('[data-setting="terms"]').trigger('change');
            }
            if( typeof(onload) !== 'object' ){
                 //var taxonomy_type = $('[data-setting="taxonomy_type"]').val();
                 var taxonomy_type = onload;
            }else{                
                var taxonomy_type = onload.val();                 
                onload.closest('.elementor-repeater-row-controls').find('[data-setting="terms"]').empty();
            }    
           
            
            //if no taxonomy selected stop the function to avoid showing null value in terms
            if( taxonomy_type == null ){
                return;
            }
            var data = {
                action: 'voidquery_ajax_terms',
                postTypeNonce : voidquery_ajax.postTypeNonce,
                taxonomy_type: taxonomy_type
            };      
            $.post(voidquery_ajax.ajaxurl, data, function(response) {        
                var terms = JSON.parse(response);                 
                $.each( terms,function( idx, value ){                    
                    onload.closest('.elementor-repeater-row-controls').find('[data-setting="terms"]').append('<option value="'+this.id+'">'+this.name+'</option>');
                });
                //set already selected value
                if( typeof(onload) === 'object' ){
                    $('[data-setting="terms"]').each( function( index, value ){                       
                        $(this).val( model.attributes.settings.attributes.tax_fields.models[index].attributes.terms);
                    });
                }        
            });  

        }//voidquery_terms()

        //when moving from Advanced tab to content model variable is null so to pass it's data
        function pass_around_model(panel,model,view){
            void_grid_get_taxonomy();
        }

        //get taxonomy
        $('#elementor-controls').on( 'change', '[data-setting="post_type"]', function( event ){
            // pass onload value false, means the value was actively changed  
            void_grid_get_taxonomy( false );
            $('[data-setting="taxonomy_type"]')[0].selectedIndex = -1;
            return true;
        });

        //get terms
        $('#elementor-controls').on( 'change', '[data-setting="taxonomy_type"]', function(){  
            //pass $this to keep the changes to each different taxonomy
            voidquery_terms( $(this) );     
            $('[data-setting="terms"]')[0].selectedIndex = -1;
            return true;
        });

        //this ensures that events are binded to the new repeater
        $('#elementor-controls').on( 'click', '.elementor-control-tax_fields .elementor-repeater-add', function( event ){
           $( '[data-setting="post_type"]' ).trigger( 'change' );
        });

        //this ensures the data remains the same even after switching back from advanced tab to content tab
        $(".elementor-panel").mouseenter(function(){
            
            pass_around_model( panel,model,view );
            
        });

    });//end .addAction
});