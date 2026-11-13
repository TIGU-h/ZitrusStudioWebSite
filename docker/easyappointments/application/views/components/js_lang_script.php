<?php
$language = html_vars('language');

unset(
    $language['about_app'],
    $language['about_app_info'],
    $language['about_app_support'],
    $language['about_app_license'],
    $language['ea_update_success'],
    $language['api_token_hint'],
    $language['api_info'],
    $language['ldap_info'],
    $language['premium'],
    $language['about_app_premium'],
    $language['go_premium'],
);
?>
<script>
    window.lang = (function () {
        const lang = <?= json_encode($language) ?>;

        return (key) => {
            if (!key) {
                return lang;
            }

            if (!lang[key]) {
                console.error(`Cannot find translation for requested key: "${key}"`);
                return key;
            }

            return lang[key];
        };
    })();
</script>

