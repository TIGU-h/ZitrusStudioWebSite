<?php
/**
 * Local variables.
 *
 * @var array $available_services
 */
?>

<div id="wizard-frame-1" class="wizard-frame p-3 p-md-4" style="visibility: hidden;">
    <div class="frame-container py-3">
        <h2 class="frame-title fw-light text-center mb-4 text-muted"><?= lang('category') ?></h2>

        <div id="category-choices" class="booking-choice-grid booking-category-grid" role="group"
             aria-label="<?= e(lang('category')) ?>"></div>
        <p id="category-selection-prompt" class="text-danger mt-3 mb-0" hidden>
            <?= lang('please_select') ?>
        </p>

        <div class="visually-hidden" aria-hidden="true">
            <label for="select-service"><?= lang('service') ?></label>
            <select id="select-service" tabindex="-1">
                <option value=""><?= lang('please_select') ?></option>
                <?php foreach ($available_services as $service): ?>
                    <option value="<?= e($service['id']) ?>"><?= e($service['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>

</div>
