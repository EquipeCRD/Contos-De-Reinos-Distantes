/**
 * Author: Equipe CDRD
 * Creation date: 2018-10-08
 * Descrição: Arquivo com scripts js compartilhados por dois ou mais documentos
 */

$(document).ready(function() {
  // Logout ====================
  sair = function() {
    $.ajax({
      type: "POST",
      url: PATH + "Logout",
      success: function() {
        window.location.href = PATH + "index.html";
      },
      error: function(info) {
        var msg = "Erro ao tentar encerrar sua sessão: ";
        alertaErro(msg, info);
      }
    });
  };

  // Alerta de Erros ==========
  alertaErro = function(msg, info) {
    alert(msg + " " + info.status + " - " + info.statusText);
  };
});