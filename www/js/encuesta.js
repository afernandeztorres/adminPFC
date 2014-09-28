/*
 * Author : Alberto Fernández
 * Target: PFC
 * Date: Aug'14
 */
 
var Encuesta = function(){

	//Url a la que se realizarán las peticiones Ajax
	var url= "http://afernandeztorres.ddns.net:8080/Encuestas/doEncuesta?";
	
	//Título de la ventana de los mensajes emergentes
	var tituloVentana='On-Encuestas';

	//Textos para los mensajes.
	var msgNotSel 			= 'Debe seleccionar una categoría y una encuesta para poder continuar';
	var msgCatNotSel 		= 'Debe seleccionar una categoría para poder continuar';
	var msgEncEnviadaOK 	= 'La encuesta se ha creado correctamente';
	var msgEncEnviadaNOK 	= 'No se ha podido crear la encuesta';
	var msgEncModifOK 		= 'La encuesta se ha modificado correctamente';
	var msgEncEliminadaNOK 	= 'Se ha eliminado de forma correcta.';
    var msgEncEliminadaOK 	= 'La encuesta se ha eliminado correctamente';
	var msgEncModifNOK 	    = 'No se ha podido modificar la encuesta';
	var msgErrorGenerico 	= 'Se ha producido un error. Contacte con el administrador';
	var msgNumPregInvalid 	= 'Número de preguntas nó valido.(Valores 1-12)';
	var msgFechCadInvalid 	= 'La fecha de caducidad no tiene un formato válido.(aaaa/mm/dd)';
	var msgNomEncInvalid 	= 'Rellene el nombre de la encuesta';
    var msgEncEnviadaKO     = 'No se puede crear la encuesta.';
    var msgConfirmElim      = '¿Está seguro de eliminar la encuesta?';


	this.j = 3; //num respuesta
	//Importamos la librería de las alertas customizadas incrustando el código en el HTML
	document.write('<script src="js/lib/jquery.alerts.js" type="text/javascript"><\/script>');
	
	
	/**
	 * Funcion que devuelve las categorías de Encuestas.
	 */
	this.getTipos = function (int) {
		var lang ="";
		lang = (int == 0)?$("#idioma input:checked").val():"es";
		//vaciamos el contenido previo.
		$("#tipoEncuesta").empty();
		$("#tipoEncuesta").html("");
        $("#tipoEncuesta").append(" <option value='0'>Categor&iacute;a</option>  ");

		llamadaAjax (url + "action=getTipos" , "&idioma="+lang,
				function (json){
						$.each(json, function (index, value){			
							//...Seteamos el subtipo y comprobamos que el tipo no este repetido 		
								$("#tipoEncuesta").append(
                                           "<option  value='"+value.id_TipoEncuesta+"'>"+value.tipo+"</option>");
								
						});
						$.mobile.hidePageLoadingMsg("b","Cargando",false);
						$.mobile.changePage("#pageBuscar");		
					});
		
	};
		
	/**
	 * 
	 */
	this.getTiposNew = function (int) {
		var lang ="";
		lang = (int == 0)?$("#idiomaNew input:checked").val():"es";
		//vaciamos el contenido previo.
		$("#tipoEncuestaNew").empty();
		llamadaAjax (url + "action=getTipos" , "&idioma="+lang,
				function (json){
					$.each(json, function (index, value){			
							//...Seteamos el subtipo y comprobamos que el tipo no este repetido 		
								$("#tipoEncuestaNew").append("<option  value='"+value.id_TipoEncuesta+"'>"+value.tipo+"</option>");
								
						});
					$.mobile.hidePageLoadingMsg("b","Cargando",false);
					$.mobile.changePage("#pageNueva");
					});
	};
	
	/**
	 * Función que nos devuleve las encuestas de una categoría.
	 */
	this.getSubTipos = function () {

		//vaciamos el contenido previo
		$("#subTipoEncuesta").empty();
		llamadaAjax (url + "action=getSubTipos" , "&idioma="+$("#idioma input:checked").val()+"&tipoEncuesta="+$("#tipoEncuesta option:selected").val(),
				function (json){
						$("#subTipoEncuesta").html("");
						$("#subTipoEncuesta").append(" <option value='0'>Encuesta</option>  ");
						$.each(json, function (index, value){			
							//...Seteamos el subtipo y comprobamos que el tipo no este repetido 
								
							$("#subTipoEncuesta").append("<option value='"+value.id_Encuesta+"'>"+value.tipo+"</option>");		
															
						});
						$.mobile.hidePageLoadingMsg("b","Cargando",false);
					});
	};
					
					
	/**
	 * Solicitar encuesta
	 */
	this.solicitarEncuesta = function (local) {	
	
			if ($("#tipoEncuesta").val() == 0 || $("#subTipoEncuesta").val() == 0 ) {
				jAlert(msgNotSel, tituloVentana);
				return false;
			} else {
			
				llamadaAjax (url + "action=find" , $("#formBuscar").serialize()  ,
						
						function (json) {
							
							$.each (json.preguntas, function (index, value){
									
									var code =  "<div id='div"+index+"' data-role='page'  >" ;
												
										
									code    +=  '<div id="header" data-theme="a" data-role="header" data-position="fixed">'+			
												'<h3> '+
		            							'	ON-ENCUESTAS  '+
		            							'</h3> '+
		            							'</div> ';
                                    code    +=	'<div style="margin:10px"><label align="right">Modifique la pregunta:</label></div>';
		            				code    +=	" <input id='pre"+value.id_Pregunta+"' data-mod='mod' name='pre"+
                                                        value.id_Pregunta+"' type='text' value='"+value.pregunta+"'>"+
		            							"<div data-role='content'>" +
		            							"<form id='formu"+index+"' name='formu"+index+"' >";
												$.each(value.respuestas, function(subIndex, subValue){
                                                    code +=	"<div style=\"margin:10px\"><label align=\"right\">Modifique la respuesta "+( subIndex+1 )+" :</label></div>";
													code += "<input id='radio"+subValue.id_Respuesta+"' data-mod='mod' data-theme='c' name='radio"+
                                                            subValue.id_Respuesta+"' value='"+
                                                            subValue.respuesta+"' type='input'>";
												});
												
									code    +=  "<br>" ; 
										
										if (index != (json.preguntas.length - 1)) code += "<a data-role='button' data-theme='c' data-iconpos='bottom' data-icon='arrow-r' href='#div"+(index+1)+"'></a>";
										else code += "<a data-role='button' data-icon='check' data-iconpos='bottom' data-theme='c' onClick='manager.sendEncuestaMod();'></a>";
										
									code    +=  "<a data-role='button' data-theme='c' data-icon='delete' data-iconpos='bottom' onClick='manager.irInicio();'></a>";
									code    +=  "</form></div>";  
									code    +=  '<div data-theme="a" data-role="footer" data-position="fixed">'+
								        		'<h3> '+
		            							'	 '+
		            							'</h3> '+
		            							'</div> ';  
									code    +=  "</div>";
									
									$("body").append( code ) ;
							});
							
							$.mobile.changePage( "#div0" );
						
						});
				}
		};

			
	/**
	 *  Bot�n enviar encuesta
	 */
	this.sendEncuestaMod = function (){
			
			if ($("#tipoEncuesta").val() == 0 || $("#subTipoEncuesta").val() == 0 ) {
				jAlert(msgNotSel, tituloVentana);
				return false;
			}
			
			llamadaAjax (url + "action=modServer" , $("input[data-mod=mod]").serialize() + "&idioma=" + $("#idiomaNew input:checked").val(),
					function (json) {


						if (json.error === "ok"){
						    $.mobile.hidePageLoadingMsg();
						    jAlert(msgEncModifOK, tituloVentana, function(r) {
                                location.reload();
                            });
						} else {
							$.mobile.hidePageLoadingMsg();
                            jAlert(msgEncModifKO, tituloVentana, function(r) {
                                location.reload();
                            });
						}

					});
	};
	/**
	 * Solicitar encuesta
	 */
	this.rellenarNueva = function (local) {	
	
			if ( this.validarNuevaEncuesta() ) {
				for (var i = 0 ; i < $("#numPreNew").val() ; i++){			
					var code =  "<div id='div"+i+"' data-role='page'  >" ;
								
						
					code    +=  '<div id="header" data-theme="a" data-role="header" data-position="fixed">'+			
								'<h3> '+
    							'	ON-ENCUESTAS  '+
    							'</h3> '+
    							'</div> ';
                    code    +=	' <div style="margin:10px"><label align="right">Introduzca la pregunta:</label></div>';
    				code    +=	" <input id='pre"+i+"' data-new='new' name='pre"+i+"' type='text' value=''>"+
    							"<div data-role='content'>" ;
    				code    +=	' <div style="margin:10px"><label align="right">Introduzca las respuestas:</label></div>';
					code    +=  "<div id='preg"+i+"'>"+
					                ' <div style="margin:10px"><label align="right">Respuesta 1:</label></div>'+
									"<input id='radio_"+i+"_1' data-new='new' data-theme='c' name='radio_"+i+"_1' value='' type='input'>"+
									' <div style="margin:10px"><label align="right">Respuesta 2:</label></div>'+
									"<input id='radio_"+i+"_2' data-new='new' data-theme='c' name='radio_"+i+"_2' value='' type='input'>"+
								"</div>"+
								"<a data-role='button' data-theme='c' data-icon='add' data-iconpos='bottom' onClick='manager.addResp(\""+i+"\");'></a>";

					code    +=  "<br>" ; 
						
						if (i != ($("#numPreNew").val() - 1)) code += "<a data-role='button' data-theme='c' data-iconpos='bottom' data-icon='arrow-r' href='#div"+(i+1)+"'></a>";
						else code += "<a data-role='button' data-icon='check' data-iconpos='bottom' data-theme='c' onClick='manager.sendEncuesta();'></a>";
						
					code    +=  "<a data-role='button' data-theme='c' data-icon='delete' data-iconpos='bottom' onClick='manager.irInicio();'></a>";
					code    +=  "</form></div>";  
					code    +=  '<div data-theme="a" data-role="footer" data-position="fixed">'+
				        		'<h3> '+								       
    							'</h3> '+
    							'</div> ';  
					code    +=  "</div>";
					
					$("body").append( code ) ;
				}
				$.mobile.changePage( "#div0" );
			} else {
				return false;
			}
	};
	
	/**
	 * 
	 */
	this.addResp = function (i){
		$("#preg"+i).append("<div style='margin:10px'><label align='right'>Respuesta "+(this.j++)+":</label></div><input id='radio_"+i+"_"+($("#preg"+i+" input").length+1)+"' data-new='new' data-theme='c' name='radio_"+i+"_"+($("#preg"+i+" input").length+1)+"' value='' type='input'>");

	};
	
	
	/**
	 *  Bot�n enviar encuesta
	 */
	this.sendEncuesta = function (){

		llamadaAjax (url + "action=addServer" , $("input[data-new=new]").serialize() + "&tipoEncuestaNew=" + $("select[data-new=new] option:selected").val() + "&idioma=" + $("#idiomaNew input:checked").val(),
				
				function (json) {
					if (json.error === "ok"){
                            $.mobile.hidePageLoadingMsg();
                            jAlert(msgEncEnviadaOK, tituloVentana, function(r) {
                                location.reload();
                            });
                        }
                        else{
                             $.mobile.hidePageLoadingMsg();
                                jAlert(msgEncEnviadaKO, tituloVentana, function(r) {
                                    location.reload();
                                });
                            }
				});
	};
		
	
	/**
	 *  Bot�n enviar encuesta
	 */
	this.delEncuesta = function (){
			
		if ($("#tipoEncuesta").val() == 0 || $("#subTipoEncuesta").val() == 0 ) {
			
			jAlert(msgNotSel, tituloVentana);
			return false;
		} else {
            jConfirm(msgConfirmElim, tituloVentana,
                function (click){
                    if (click){
                        llamadaAjax(url + "action=delServer", $("#subTipoEncuesta").serialize(),
                         function (json) {
                             if (json.error === "ok") {
                                 $.mobile.hidePageLoadingMsg();
                                 jAlert(msgEncEliminadaOK, tituloVentana, function (r) {
                                     $.mobile.changePage( "#pageMenu" );
                                     location.reload();
                                     });
                             }
                             else {
                                 $.mobile.hidePageLoadingMsg();
                                 jAlert(msgEncEliminadaKO, tituloVentana, function (r) {
                                     $.mobile.changePage( "#pageMenu" );
                                     location.reload();
                                 });
                             }
                         })

                    };
                }
            );
		}
	};
		
	 /**
	 *  Bot�n cancelar encuesta
	 */
	this.irInicio = function (){
		
			$.mobile.changePage( "#pageMenu" );
			location.reload();

	};
	
	/**
	 * Solicitar encuesta
	 */
	this.solicitarGrafico = function () {

        var res = false;
		
		if ($("#tipoEncuesta").val() == 0 || $("#subTipoEncuesta").val() == 0 ) {
			jAlert(msgNotSel, tituloVentana);
			res = false;
		} else {

            var estLocal = 'c';
            var idioma ="es";

            llamadaAjax (url + "action=grafico" , "&tipoEncuesta=" + $("#tipoEncuesta").val() + "&subTipoEncuesta=" + $("#subTipoEncuesta").val() + "&idioma=" + idioma ,

                function (json) {
                    $("#graficos").html("");
                    $.each (json.preguntas, function (index, value){

                        var code    =	" <br><center> <div id='grafico"+index+"' style='width:400px; height:225px;'></div> </center></br>";
                        $("#graficos").append( code ) ;
                        var comp = "#grafico"+index;
                        var pre  = value.pregunta;
                        var dataData = [];
                        var dataAxis = [];
                        $.each(value.respuestas, function(subIndex, subValue){

                            dataData.push ([subValue.id_Respuesta, subValue.contador]);
                            dataAxis.push ([subValue.id_Respuesta, subValue.respuesta]);
                        });

                        $.plot(
                            $(comp),
                            [
                                {
                                    label: pre,
                                    data: dataData,
                                    bars: {
                                        show: true,
                                        barWidth: 0.1,
                                        align: "center"
                                    }
                                }
                            ],
                            {
                                xaxis: {
                                    ticks: dataAxis
                                }
                            }
                        );

                        var code2     =  "<br><br><p style='padding=10px'></p><br><br>" ;
                        $( comp ).append( code2 ) ;
                    });
                });
            $.mobile.changePage( "#pageGrafico" );
            res = true;
		}
        return res;
	};


	/**
	 * Error generico 
	 */
	function errorGenerico(){
		
		jAlert(msgErrorGenerico, tituloVentana);
		$.mobile.hidePageLoadingMsg("b","Cargando",true);
	}
	
	/**
	 *	Esta función resetea el contenido de los combos y llama a la carga de los datos
	 *	con el nuevo idioma seleccionado.
	 */
	function renderIdiomas(){
		
		var nuevoIdioma = $("#idiomaNew").val();
	}
	
	/**
	 * Valida que no se introduzca por teclado un valor menor que 1.
	 */
	function validarNumPreg(){
		
		if ($("#numPreguntas").val() < 1) {
			$("#numPreguntas").val = 1;
		}
			
	}
	
	/**
	 * Llamada ajax genérica
	 */
	 function llamadaAjax  (url, data, succes){
	
		$.ajax({
			dataType: "jsonp",
			method: "GET",
			timeout: 6000,
			data: data,
			url: url,
			beforeSend : function (){
				$.mobile.showPageLoadingMsg("b","Cargando",false);
			},	
			success: succes,
			error: errorGenerico,
		});

	 };
	 
	/**
	 * Pone el foco en la página de inicio
	 */
	 this.irInicio  = function (){
			
			$.mobile.changePage( "#pageMenu" );
			location.reload();

	};
	 
	/*
	 * Funcion para validar el formulario de crear encuesta
	 */
	this.validarNuevaEncuesta = function(){
		var isValid = true;
		if ($("#tipoEncuestaNew").val() == 0){
			jAlert(msgCatNotSel, tituloVentana);
			isValid = false;
		} else if ($("#subTipoEncuestaNew").val()== ''){
			jAlert(msgNomEncInvalid, tituloVentana);
			isValid = false;
		} else if ( ($("#numPreNew").val()<1) || ($("#numPreNew").val()>12) ){
			jAlert(msgNumPregInvalid, tituloVentana);
			isValid = false;
		} else if ($("#fechaCad").val()==''){
			jAlert(msgFechCadInvalid, tituloVentana);
			isValid = false;
		};
		return isValid;
	};
	
	/*
	 * Funcion que renderiza el idioma en el que se creará la encuesta
	 */
	this.recargarCategriasIdioma = function(combo){
		
		(combo == 'idioma')?this.getTipos(0):this.getTiposNew(0);
	}
}
    
