/**
 * 
 */

 
var Estilos = function (estilo, tema) {
	
	this.estiloDefault = estilo;
	this.temaDefault = tema;
	
	
	
	this.cambioEstilo = function ( estiloNuevo, temaNuevo){
			
		
			if (estiloNuevo == this.estiloDefault) return false;
			
			var estiloAnterior  =  this.estiloDefault;
			
			this.estiloDefault  =  estiloNuevo;
			this.temaDefault    =  temaNuevo;
			
			$.each($('body *'), function (index, value){
								
							if ( value != undefined ){ 			
									var tex = $(value).attr("class");
									
								if (tex != undefined){	
									$(value).removeClass();
									$(value).toggleClass( tex.replace(estiloAnterior, estiloNuevo) );
									
								}
								var tex2 = $(value).attr("data-theme");
								if (tex2 != undefined)
										$(value).attr("data-theme", temaNuevo);
							}
							
			});
		};	


}