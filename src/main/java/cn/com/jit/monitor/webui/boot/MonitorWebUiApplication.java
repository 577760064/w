package cn.com.jit.monitor.webui.boot;


import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@ComponentScan("cn.com.jit.monitor.*")
@ImportResource(locations={"classpath*:/META-INF/platform/tempspring-web*.xml"})
@PropertySource("file:config/conf/platform.properties")
public class MonitorWebUiApplication {
    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(MonitorWebUiApplication.class);
        springApplication.setWebEnvironment(true);
        ApplicationContext applicationContext = springApplication.run(args);
        System.out.println("The service has started port : 23443");
    }

}
