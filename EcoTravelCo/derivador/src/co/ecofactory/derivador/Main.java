package co.ecofactory.derivador;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class Main {

    public static void main(String[] args) throws Exception {
        String rutaPOM = args[0];
        String rutaEjecutable = args[1];
        String rutaConfig = args[2];

        String pom = new String(Files.readAllBytes(Paths.get(rutaPOM)));
        String[] modulos = Files.readAllLines(Paths.get(rutaConfig)).toArray(new String[]{});

        String modulosPOM = "";
        String modulosEjecutable = "";

        for (int i = 0; i < modulos.length; i++) {
            String modulo = modulos[i];

            if (!modulo.startsWith("CORE_")) {

                if (modulo.equals("EnvioMensajes")) {
                    modulosPOM += "<dependency>\n" +
                            "            <groupId>co.ecofactory</groupId>\n" +
                            "            <artifactId>mod-message</artifactId>\n" +
                            "            <version>3.2.1</version>\n" +
                            "        </dependency>";
                }
                if (modulo.equals("CalificarServicios")) {
                    modulosPOM += "<dependency>\n" +
                            "            <groupId>co.ecofactory</groupId>\n" +
                            "            <artifactId>mod-calificacion</artifactId>\n" +
                            "            <version>3.2.1</version>\n" +
                            "        </dependency>";
                }
                modulosEjecutable += " -D" + modulo + "=ACTIVO ";
            }
        }

        if (!modulosPOM.equals("")) {
            pom = pom.replaceAll("<!--modulos-->", modulosPOM);
        }


        Files.write(Paths.get(rutaPOM), pom.getBytes(), StandardOpenOption.TRUNCATE_EXISTING);

        String ejecutable = "java -jar target/mod-core-3.2.1-fat.jar " + modulosEjecutable;


        Files.write(Paths.get(rutaEjecutable), ejecutable.getBytes(), StandardOpenOption.TRUNCATE_EXISTING);

    }
}