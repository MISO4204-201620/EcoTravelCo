package co.ecofactory.ecotravel.producto.service.dao;

import co.ecofactory.ecotravel.utils.JsonUtils;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;

import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;


public class ProductoDAO {
    private JDBCClient dataAccess;

    public ProductoDAO(Vertx vertx, JsonObject conf) {

        dataAccess = JDBCClient.createShared(vertx, conf);
    }

    //Listar productos
    public CompletableFuture<List<JsonObject>> listarProductos() {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();
        String query = "SELECT p.id, p.estado, p.nombre, p.fecha_registro, p.fecha_actualizacion, p.calificacion_promedio, \n" +
                "       p.id_padre,p.id_direccion_id, tp.tipo, p.descripcion, p.precio\n" +
                "  FROM public.mp_producto p, public.mp_tipo_producto tp\n" +
                "  where p.tipo_producto_id=tp.id;";
        JsonArray params = new JsonArray();
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                                System.out.println("En el If respuesta " + res);

                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {

                    }
                }
        );
        return res;
    }

    public CompletableFuture<List<JsonObject>> listarProductosHome() {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();
        String query = "select a.*, b.*, c.* from mp_producto a left join mp_tipo_producto b on a.tipo_producto_id=b.id left join mp_galeria c on a.id=c.producto_id";
        JsonArray params = new JsonArray();
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                                System.out.println("En el If respuesta " + res);

                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
        );
        return res;
    }

    public CompletableFuture<List<JsonObject>> listarProductosDetalle(String id) {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();
        System.out.println("entro id = "+id);
        String query = "select a.*, b.*, c.* from mp_producto a left join mp_tipo_producto b on a.tipo_producto_id=b.id left join mp_galeria c on a.id=c.producto_id where  c.foto_principal=1 and a.id=" + id;
        JsonArray params = new JsonArray();
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                                System.out.println("En el If respuesta " + res);

                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {

                    }
                }
        );
        return res;
    }

    //Listar un producto
    public CompletableFuture<List<JsonObject>> listarProducto(Long id) {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();
        String query = "SELECT p.id, p.estado, p.nombre, p.fecha_registro, p.fecha_actualizacion, p.calificacion_promedio, \n" +
                "       p.id_padre,p.id_direccion_id, tp.tipo, p.descripcion, p.precio\n" +
                "  FROM public.mp_producto p, public.mp_tipo_producto tp\n" +
                "  where p.tipo_producto_id=tp.id and p.id = " + id;
        JsonArray params = new JsonArray();
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                                System.out.println("En el If respuesta listar producto" + data.result().getRows().size());
                            } else {
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
        );
        return res;
    }

    //Insertar un producto
    public CompletableFuture<JsonObject> insertarProducto(JsonObject nuevoProducto) {
        final CompletableFuture<JsonObject> res = new CompletableFuture<>();
        //Definicion de los datos a guardar del producto
        JsonArray params = new JsonArray();
        /*JsonUtils.add(params, nuevoProducto.getString("id", ""));
        JsonUtils.add(params, nuevoProducto.getString("estado", ""));
        JsonUtils.add(params, nuevoProducto.getString("nombre", ""));
        JsonUtils.add(params, new Date().toInstant());
        JsonUtils.add(params, new Date().toInstant());
        JsonUtils.add(params, nuevoProducto.getDouble("calificacion_promedio", 0.0));
        JsonUtils.add(params, nuevoProducto.getInteger("id_padre", 0));
        JsonUtils.add(params, nuevoProducto.getInteger("id_direccion_id", 0));
        JsonUtils.add(params, nuevoProducto.getInteger("tipo_producto_id", 0));
        JsonUtils.add(params, nuevoProducto.getString("descripcion",""));
        JsonUtils.add(params, nuevoProducto.getDouble("precio",0D));*/

        JsonUtils.add(params, Integer.parseInt(nuevoProducto.getString("id", "")));
        JsonUtils.add(params, nuevoProducto.getString("estado", ""));
        JsonUtils.add(params, nuevoProducto.getString("nombre", ""));
        JsonUtils.add(params, new Date().toInstant());
        JsonUtils.add(params, new Date().toInstant());
        //JsonUtils.add(params, Double.parseDouble(nuevoProducto.getString("calificacion_promedio", "")));
        JsonUtils.add(params, 5.0D);
        JsonUtils.add(params, Integer.parseInt(nuevoProducto.getString("id_padre", "")));
        JsonUtils.add(params, Integer.parseInt(nuevoProducto.getString("id_direccion_id", "")));
        JsonUtils.add(params, Integer.parseInt(nuevoProducto.getString("tipo_producto_id", "")));
        JsonUtils.add(params, nuevoProducto.getString("descripcion",""));
        JsonUtils.add(params, Double.parseDouble(nuevoProducto.getString("precio","")));

        System.out.println("-------->>>>>>>>>>");
        System.out.println("-------->>>>>>>>>> ");
        String query = "INSERT INTO public.mp_producto(\n" +
                "            id, estado, nombre, fecha_registro, fecha_actualizacion, calificacion_promedio, \n" +
                "            id_padre, id_direccion_id, tipo_producto_id,descripcion,precio)\n" +
                "    VALUES (?,?,?,to_timestamp(?, 'yyyy-mm-dd hh24:mi:ss'),to_timestamp(?, 'yyyy-mm-dd hh24:mi:ss'),?,?,?,?,?,?);\n";

        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().updateWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().toJson());
                            } else {
                                data.cause().printStackTrace();
                                System.out.println("Error insertar producto DAO print");
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
        );
        return res;
    }

    //Editar un producto
    public CompletableFuture<JsonObject> editarProducto(JsonObject editProducto, Long id) {
        final CompletableFuture<JsonObject> res = new CompletableFuture<>();

        //Definicion de los datos a guardar del producto
        JsonArray params = new JsonArray();
        System.out.println("Que ID llega al DAO " + id);
        JsonUtils.add(params, editProducto.getString("estado", ""));
        JsonUtils.add(params, editProducto.getString("nombre", ""));
        JsonUtils.add(params, new Date().toInstant());
        JsonUtils.add(params, editProducto.getDouble("calificacion_promedio", 0.0));
        JsonUtils.add(params, editProducto.getInteger("id_padre", 0));
        JsonUtils.add(params, editProducto.getInteger("id_direccion_id", 0));
        JsonUtils.add(params, editProducto.getInteger("tipo_producto_id", 0));
        JsonUtils.add(params, editProducto.getString("descripcion",""));
        JsonUtils.add(params, editProducto.getDouble("precio",0D));

        String query = "UPDATE public.mp_producto\n" +
                "   SET estado=?, nombre=?, fecha_actualizacion=to_timestamp(?, 'yyyy-mm-dd hh24:mi:ss'), \n" +
                "       calificacion_promedio=?, id_padre=?, id_direccion_id=?, tipo_producto_id=?,descripcion=?,precio=?\n" +
                " WHERE id=" + id + ";";

        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().updateWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().toJson());
                                System.out.println("Editar producto DAO");
                            } else {
                                data.cause().printStackTrace();
                                System.out.println("Error editar producto DAO print");
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
        );
        return res;
    }

    //Borrar un producto
    public CompletableFuture<JsonObject> borrarProducto(Long id) {
        final CompletableFuture<JsonObject> res = new CompletableFuture<>();

        String query = "DELETE FROM public.mp_producto\n" +
                " WHERE id=" + id + ";";

        JsonArray params = new JsonArray();
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().updateWithParams(query, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().toJson());
                                System.out.println("Borrar producto DAO");
                            } else {
                                data.cause().printStackTrace();
                                System.out.println("Error Borrar producto DAO print");
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
        );
        return res;
    }


    //Listar un producto
    public CompletableFuture<List<JsonObject>> listarProductosBusqueda(JsonObject criterios) {
        final CompletableFuture<List<JsonObject>> res = new CompletableFuture<List<JsonObject>>();
        System.out.println("ini");
       // criterios.getString("search", "")
        String[] split = criterios.getString("criterios").split("%20");
        String query = "";

        for (int i=0; split.length>i; i++) {
            String search = split[i];
            if (!search.equals("")) {
                if (i !=0)
                    query += " UNION ";
                 query += "SELECT DISTINCT  p.id, p.estado, p.nombre, p.fecha_registro, p.fecha_actualizacion, p.calificacion_promedio, p.id_padre,p.id_direccion_id, tp.tipo, p.descripcion, p.precio , pe.nombre\n" +
                        "FROM public.mp_producto p inner join  public.mp_tipo_producto tp on tp.id= p.tipo_producto_id inner join mp_persona pe on pe.id= p.id_usuario\n" +
                        "where UPPER(p.nombre) like UPPER('%"+search+"%') or\n" +
                        "UPPER(tp.tipo) like UPPER('%"+search+"%') or\n" +
                         "UPPER(tp.descripcion) like UPPER('%"+search+"%') or\n" +
                         "UPPER(p.descripcion) like UPPER('%"+search+"%') or\n" +
                        "UPPER(pe.nombre) like UPPER('%"+search+"%') or\n" +
                        "UPPER(pe.nombre_sec) like UPPER('%"+search+"%') or\n" +
                        "UPPER(pe.apellido) like UPPER('%"+search+"%') or\n" +
                        "UPPER(pe.apellido_sec) like UPPER('%"+search+"%') AND UPPER(p.estado)='ACTIVO'";
            }
            
        }
        final String queryf=query+";";

        System.out.println("Query"+ queryf);
        JsonArray params = new JsonArray();
        dataAccess.getConnection(conn -> {
                    if (conn.succeeded()) {
                        conn.result().queryWithParams(queryf, params, data -> {
                            if (data.succeeded()) {
                                res.complete(data.result().getRows());
                                System.out.println("En el If respuesta listar producto" + data.result().getRows().size());
                            } else {
                                System.out.println("err "+ data.cause());
                                data.cause().printStackTrace();
                                res.completeExceptionally(data.cause());
                            }
                        });
                    } else {
                        conn.cause().printStackTrace();
                    }
                    try {
                        conn.result().close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
        );
        return res;
    }


}
