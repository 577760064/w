package cn.com.jit.monitor.webui.controller;

import cn.com.jit.cube.framework.rest.client.CubeRestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.LocaleResolver;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;

/**
 * @Author 刘洋
 * @Date 2018/8/3 8:41
 * @Description
 */
@Controller
@RequestMapping("/test")
public class HtmlServletController {
    Logger log = LoggerFactory.getLogger(HtmlServletController.class);

//    @Autowired
//    private MessageSource messageSource;
//    Locale locale = LocaleContextHolder.getLocale();
//
//    @Autowired
//    private CubeRestClient cubeRestClient;
//
//    @Autowired
//    private LocaleResolver localeResolver;




    @RequestMapping(value="/test" ,method=RequestMethod.GET)
    public  String test(){
        return "index";
    }


    @RequestMapping(value="/index.html" ,method=RequestMethod.GET)
    public String  returnIndex(ModelMap model,HttpServletRequest request){
//        Manager manager = (Manager) request.getSession().getAttribute(Constant.SYSTEMLOGINADMIN);
//        model.put("manager", manager);
//        String locale = localeResolver.resolveLocale(request).toString();
//        String key = "messages_" + locale + ".properties";
//        String i18n = cache.getI18nLocal(key);
//        model.addAttribute( "i18n", i18n );
        return "index";
    }


}
