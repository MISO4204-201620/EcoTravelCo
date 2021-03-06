package co.ecofactory.ecotravel.preguntas.service.dao;

import co.ecofactory.ecotravel.utils.JsonUtils;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class PreguntasDAO {
    private JDBCClient dataAccess;

    public PreguntasDAO(Vertx vertx, JsonObject conf) {

        dataAccess = JDBCClient.createShared(vertx, conf);
    }

    public CompletableFuture<List<JsonObject>> listarPreguntas(int idProducto) {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();
        String query = "select  a.pregunta, to_char(a.fecha_registro, 'YYYY-MM-DD HH24:MI:SS') as fecha_registro, a.respuesta, to_char(a.fecha_respuesta, 'YYYY-MM-DD HH24:MI:SS') as fecha_respuesta ,\n" +
                "(case when pe.nombre isnull then '' else (pe.nombre)|| ' ' end)||(case when pe.nombre_sec isnull then '' else (pe.nombre_sec)|| ' ' end)||(case when pe.apellido isnull then '' else (pe.apellido)|| ' ' end)||(case when pe.apellido_sec isnull then '' else (pe.apellido_sec) end) as usuario\n" +
                ",pe.foto\n" +
                "from mp_preguntas a left join mp_persona pe on a.id_persona_id=pe.id\n" +
                "where a.id_producto= ? order by fecha_registro desc;\n";
        JsonArray params = new JsonArray();
        JsonUtils.add(params, idProducto);

        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try{
                        conn.result().close();
                    }catch(Exception e){

                    }
                }
        );
        return res;
    }



    public CompletableFuture<List<JsonObject>> listarPreguntasByUser(int idUsuario, int tipo) {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();

        String query="";
        if(tipo == 0)
            query = "select   a.pregunta, to_char(a.fecha_registro, 'YYYY-MM-DD HH24:MI:SS') as fecha_registro, a.respuesta, to_char(a.fecha_respuesta, 'YYYY-MM-DD HH24:MI:SS') as fecha_respuesta , p.nombre, p.id, g.url\n" +
                    "from mp_preguntas a left join mp_producto p on a.id_producto=p.id left join mp_galeria g on g.producto_id=p.id and foto_principal =1\n" +
                    "where a.id_persona_id= ? order by fecha_registro desc\n";
        else
            query = "select   a.id as identificador, a.pregunta, to_char(a.fecha_registro, 'YYYY-MM-DD HH24:MI:SS') as fecha_registro, a.respuesta, to_char(a.fecha_respuesta, 'YYYY-MM-DD HH24:MI:SS') as fecha_respuesta , p.nombre, p.id, g.url\n" +
                    ",(case when pe.nombre isnull then '' else (pe.nombre)|| ' ' end)||(case when pe.nombre_sec isnull then '' else (pe.nombre_sec)|| ' ' end)||(case when pe.apellido isnull then '' else (pe.apellido)|| ' ' end)||(case when pe.apellido_sec isnull then '' else (pe.apellido_sec) end) as usuario\n" +
                    "from mp_preguntas a left join mp_producto p on a.id_producto=p.id left join mp_galeria g on g.producto_id=p.id and foto_principal =1 left join mp_persona pe on a.id_persona_id=pe.id\n" +
                    "where p.id_usuario= ? order by fecha_registro desc";
        JsonArray params = new JsonArray();
        JsonUtils.add(params, idUsuario);

        final String finalQuery = query;
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(finalQuery, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try{
                        conn.result().close();
                    }catch(Exception e){

                    }
                }
        );
        return res;
    }


    public CompletableFuture<JsonObject> agregarPregunta(int idUsuario, int idProducto, String pregunta) {
        final CompletableFuture<JsonObject> res = new CompletableFuture<JsonObject>();


        String query = "INSERT INTO mp_preguntas(\n" +
                "id, pregunta,fecha_registro, id_persona_id, id_producto)\n" +
                "VALUES (nextval('mp_preguntas_id_seq'), ?, to_timestamp(?, 'yyyy-mm-dd hh24:mi:ss'), ? , ? );";


        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();

        JsonArray params = new JsonArray();
        JsonUtils.add(params, pregunta);
        JsonUtils.add(params, dateFormat.format(date));
        if (idUsuario == 0)
            JsonUtils.add(params, null);
        else
            JsonUtils.add(params, idUsuario);
        JsonUtils.add(params, idProducto);

        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().updateWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().toJson());
                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try{
                        conn.result().close();
                    }catch(Exception e){

                    }
                }
        );
        return res;
    }



    public CompletableFuture<JsonObject> responderPregunta(int id_pregunta,String respuesta) {
        final CompletableFuture<JsonObject> res = new CompletableFuture<JsonObject>();


        String query = "Update mp_preguntas set respuesta= ?,  fecha_respuesta=to_timestamp(?, 'yyyy-mm-dd hh24:mi:ss') where id=?;";


        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();

        JsonArray params = new JsonArray();

        JsonUtils.add(params, respuesta);
        JsonUtils.add(params, dateFormat.format(date));
        JsonUtils.add(params, id_pregunta);

        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().updateWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().toJson());
                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try{
                        conn.result().close();
                    }catch(Exception e){

                    }
                }
        );
        return res;
    }

}
